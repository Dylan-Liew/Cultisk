import {
  CardEntry,
  CommitFunction, CommitRootSateStateFunction,
  CommitRootStateFunction,
  CommitStateFunction,
  PasswordEntry,
  PasswordManagerAllDataResponse,
  PasswordManagerUpdateResponse,
  ProtectedSymmetricKeyResponse,
  ServerResponse,
} from '@/types/custom.d';
import GenerateClient from '@/helpers/request';
import forge from 'node-forge';
import hkdf from 'futoin-hkdf';

const crypto = require('crypto');
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// TODO: Set Unlocked to false after development is done
const state = {
  passwords: [],
  cards: [],
  selectedPassword: {},
  selectedCard: {},
  vaultSetup: false,
  encryptionSettings: {
    iterations: 100000,
  },
  symmetricKey: '',
  lastUnlocked: null,
  unlocked: false,
  expireIn: 1200,
  // Value in seconds ^
};

interface EncryptionSettings {
  iterations: number;
}
interface PasswordEntryStore extends PasswordEntry {
  encrypted: boolean;
}

interface CardEntryStore extends CardEntry {
  encrypted: boolean;
}

interface State {
  passwords: PasswordEntryStore[];
  cards: CardEntryStore[];
  selectedPassword: PasswordEntryStore;
  selectedCard: CardEntryStore;
  encryptionSettings: EncryptionSettings;
  symmetricKey: string;
  lastUnlocked: number;
  vaultSetup: boolean;
  unlocked: boolean;
  expireIn: number;
}

interface RootState extends State {
  Auth: {
    token: string;
    GUserID: string;
  };
}

interface SetupVaultInput {
  hint: string | null;
  password: string;
}

class ProtectedInfo {
  encType: string;

  iv: string;

  ct: string;

  string: string;

  constructor(encType: string, iv: string, ct: string) {
    this.encType = encType;
    this.iv = iv;
    this.ct = ct;
    this.string = `${encType}.${iv}|${ct}`;
  }
}

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function EncParser(data: string) {
  const [encType, temp] = data.split('.');
  const [iv, ct] = temp.split('|');
  return new ProtectedInfo(encType, iv, ct);
}

function Decrypt(symmetricKey: string | ArrayBuffer, iv: string, encrypted: string) {
  const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(symmetricKey, 'raw'));
  const ciphertext = forge.util.createBuffer(forge.util.hexToBytes(encrypted));
  decipher.start({ iv });
  decipher.update(ciphertext);
  decipher.finish();
  return decipher.output;
}

function Encrypt(symmetricKey: string | ArrayBuffer, iv: string, plaintext: string, encoding: 'raw' | 'utf8') {
  const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(symmetricKey, 'raw'));
  const text = forge.util.createBuffer(plaintext, encoding);
  cipher.start({ iv });
  cipher.update(text);
  cipher.finish();
  return new ProtectedInfo('AES-CBC', forge.util.createBuffer(iv, 'raw').toHex(), cipher.output.toHex());
}

function CalculateMasterKey(password: string, salt: string, settings: EncryptionSettings) {
  const masterKey: Buffer = crypto.pbkdf2Sync(password, salt, settings.iterations, 256 / 8, 'sha256');
  const stretchedMasterKeyB: Buffer = hkdf.expand('sha256', 512 / 8, masterKey, 256 / 8, '');
  const stretchedMasterKey = toArrayBuffer(stretchedMasterKeyB);
  const masterKeyHash: Buffer = crypto.pbkdf2Sync(masterKey, password, 1, 256 / 8, 'sha256');
  return [stretchedMasterKey, masterKeyHash.toString('hex')];
}

function GenerateProtectedSymmetricKey(stretchedMasterKey: ArrayBuffer | string) {
  // 256 bit key
  const symmetricKey = forge.random.getBytesSync(32);
  // 128 bit IV
  const iv = forge.random.getBytesSync(16);
  return Encrypt(stretchedMasterKey, iv, symmetricKey, 'raw');
}

function DecryptSymmetricKey(stretchedMasterKey: ArrayBuffer | string, protectedKey: ProtectedInfo) {
  return Decrypt(stretchedMasterKey, forge.util.hexToBytes(protectedKey.iv), protectedKey.ct);
}

function DecryptValue(keyHex: string, encIVHex: string, valueHex: string) {
  const encKey = forge.util.hexToBytes(keyHex);
  const encIV = forge.util.hexToBytes(encIVHex);
  return Decrypt(encKey, encIV, valueHex).toString();
}

function DecryptResult(keyHex: string, result: PasswordEntryStore | CardEntryStore) {
  const decrypted: { [index: string]: string } = { ...result };
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && key !== 'uuid') {
      const enc = EncParser(value);
      decrypted[key] = DecryptValue(keyHex, enc.iv, enc.ct);
    }
  }
  return decrypted;
}

function EncryptValue(keyHex: string, valueUft8: string) {
  const key = forge.util.hexToBytes(keyHex);
  const iv = forge.random.getBytesSync(16);
  return Encrypt(key, iv, valueUft8, 'utf8').string;
}

function EncryptEntry(keyHex: string, entry: PasswordEntry | CardEntry) {
  const encrypted: { [index: string]: string } = { ...entry };
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(entry)) {
    if (typeof value === 'string' && key !== 'uuid') {
      encrypted[key] = EncryptValue(keyHex, value);
    }
  }
  return encrypted;
}

const getters = {
  allPasswords: (state: State) => state.passwords,
  allCards: (state: State) => state.cards,
  encryptionSettings: (state: State) => state.encryptionSettings,
  isUnlocked: (state: State) => state.unlocked,
  key: (state: State) => state.symmetricKey,
  selectedCard: (state: State) => state.selectedCard,
  selectedPassword: (state: State) => state.selectedPassword,
  expireIn: (state: State) => state.expireIn,
  setupStatus: (state: State) => state.vaultSetup,
};

const actions = {
  async RetrievePWManagerData({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.get('/password-manager/data/');
    if (response.status === 401) {
      commit('AuthenticationExpired');
    } else {
      const ResponseData: PasswordManagerAllDataResponse = response.data;
      commit('SetPWData', ResponseData);
    }
  },
  async UnlockVault({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>, password: string) {
    const instance = GenerateClient(rootState.Auth.token);
    const [stretchedKey, hash] = CalculateMasterKey(password, rootState.Auth.GUserID, state.encryptionSettings);
    const response = await instance.post('/password-manager/check-password/', { hash });
    const ResponseData: ProtectedSymmetricKeyResponse = response.data;
    if (ResponseData.success) {
      const protectedKey = EncParser(response.data);
      const symmetricKey = DecryptSymmetricKey(stretchedKey, protectedKey);
      commit('UnlockVault', symmetricKey.toHex());
    }
  },
  async SetupVault({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>, { hint, password }: SetupVaultInput) {
    const instance = GenerateClient(rootState.Auth.token);
    const [stretchedKey, hash] = CalculateMasterKey(password, rootState.Auth.GUserID, state.encryptionSettings);
    const protectedSymmetricKey = GenerateProtectedSymmetricKey(stretchedKey);
    const symmetric = protectedSymmetricKey.string;
    const symmetricKey = DecryptSymmetricKey(stretchedKey, protectedSymmetricKey);
    const response = await instance.post('/password-manager/setup-vault/', { hash, symmetric, hint });
    const ResponseData: ServerResponse = response.data;
    if (ResponseData.success) {
      commit('UnlockVault', symmetricKey.toHex());
    }
  },
  async CheckVaultStatus({ commit, rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.Auth.token);
    const response = await instance.get('/password-manager/setup-vault/');
    const ResponseData: ServerResponse = response.data;
    if (ResponseData.success) {
      commit('SetupComplete');
    }
  },
  getCardByUUID({ commit, state }: CommitStateFunction<State>, uuid: string) {
    const entries = state.cards;
    const result: CardEntryStore = entries.filter((obj) => obj.uuid === uuid)[0];
    if (result.encrypted) {
      result.encrypted = false;
      commit('SetSelectedCard', DecryptResult(state.symmetricKey, result));
    } else {
      commit('SetSelectedCard', result);
    }
  },
  getPasswordByUUID({ commit, state }: CommitStateFunction<State>, uuid: string) {
    const entries = state.passwords;
    const result: PasswordEntryStore = entries.filter((obj) => obj.uuid === uuid)[0];
    if (result.encrypted) {
      result.encrypted = false;
      commit('SetSelectedPassword', DecryptResult(state.symmetricKey, result));
    } else {
      commit('SetSelectedPassword', result);
    }
  },
  CheckExpiry({ commit, state }: CommitStateFunction<State>) {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const expiryTime = state.lastUnlocked + state.expireIn;
    if (currentTime > expiryTime) {
      commit('LockVault');
    }
  },
  async AddNewCardEntry({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>, data: CardEntry) {
    const instance = GenerateClient(rootState.Auth.token);
    const enc_data = EncryptEntry(state.symmetricKey, data);
    const response = await instance.post('/password-manager/cards/', enc_data);
    const ResponseData: ServerResponse = response.data;
    if (ResponseData.success) {
      commit('AddCardEntry', data);
    }
  },
  async AddNewPasswordEntry({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>, data: PasswordEntry) {
    const instance = GenerateClient(rootState.Auth.token);
    const enc_data = EncryptEntry(state.symmetricKey, data);
    const response = await instance.post('/password-manager/passwords/', enc_data);
    const ResponseData: ServerResponse = response.data;
    if (ResponseData.success) {
      commit('AddPasswordEntry', data);
    }
  },
  async UpdatePasswordEntry({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>, data: PasswordEntry) {
    const instance = GenerateClient(rootState.Auth.token);
    const enc_data = EncryptEntry(state.symmetricKey, data);
    const response = await instance.put(`/password-manager/password/${data.uuid}`, enc_data);
    const ResponseData: PasswordManagerUpdateResponse = response.data;
    if (ResponseData.success && Object.prototype.hasOwnProperty.call(ResponseData, 'data')) {
      commit('AddPasswordEntry', data);
    }
  },
  async UpdateCardEntry({ commit, rootState, state }: CommitRootSateStateFunction<State, RootState>, data: CardEntry) {
    const instance = GenerateClient(rootState.Auth.token);
    const enc_data = EncryptEntry(state.symmetricKey, data);
    const response = await instance.put(`/password-manager/card/${data.uuid}`, enc_data);
    const ResponseData: PasswordManagerUpdateResponse = response.data;
    if (ResponseData.success && Object.prototype.hasOwnProperty.call(ResponseData, 'data')) {
      commit('AddCardEntry', data);
    }
  },
  RemoveCardEntry({ commit }: CommitFunction, uuid: string) {
    commit('RemoveCard', uuid);
  },
  RemovePasswordEntry({ commit }: CommitFunction, uuid: string) {
    commit('RemovePassword', uuid);
  },
};

const mutations = {
  SetPWData: (state: State, PWData: PasswordManagerAllDataResponse): void => {
    const PasswordStore: PasswordEntryStore[] = PWData.data.passwords.map((x) => {
      const enc = EncParser(x.name);
      const decrypted = DecryptValue(state.symmetricKey, enc.iv, enc.ct);
      return { encrypted: true, ...x, name: decrypted };
    });
    const CardStore: CardEntryStore[] = PWData.data.cards.map((x) => {
      const enc = EncParser(x.name);
      const decrypted = DecryptValue(state.symmetricKey, enc.iv, enc.ct);
      return { encrypted: true, ...x, name: decrypted };
    });
    state.passwords = PasswordStore;
    state.cards = CardStore;
  },
  SetupComplete: (state: State): void => {
    state.vaultSetup = true;
  },
  UnlockVault: (state: State, keyHex: string): void => {
    state.vaultSetup = true;
    state.symmetricKey = keyHex;
    state.unlocked = true;
    state.lastUnlocked = Math.floor(new Date().getTime() / 1000);
  },
  LockVault: (state: State): void => {
    state.unlocked = false;
    state.symmetricKey = '';
  },
  AddCardEntry: (state: State, entry: CardEntry): void => {
    const { cards } = state;
    const entryStore: CardEntryStore = { ...entry, encrypted: false };
    cards.concat(entryStore);
    state.cards = cards;
  },
  AddPasswordEntry: (state: State, entry: PasswordEntry): void => {
    const { passwords } = state;
    const entryStore: PasswordEntryStore = { ...entry, encrypted: false };
    passwords.concat(entryStore);
    state.passwords = passwords;
  },
  RemoveCard: (state: State, uuid: string): void => {
    const entries = state.cards;
    state.cards = entries.filter((obj) => obj.uuid !== uuid);
  },
  RemovePassword: (state: State, uuid: string): void => {
    const entries = state.passwords;
    state.passwords = entries.filter((obj) => obj.uuid !== uuid);
  },
  SetSelectedCard: (state: State, value: CardEntryStore): void => {
    state.selectedCard = value;
  },
  SetSelectedPassword: (state: State, value: PasswordEntryStore): void => {
    state.selectedPassword = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
