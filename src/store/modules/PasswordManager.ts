import pbkdf2 from 'crypto-js/pbkdf2';
import Aes from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import base64 from 'crypto-js/enc-base64';
import WordArray from 'crypto-js/lib-typedarrays';
import {
  CardEntry,
  CommitFunction, CommitRootStateFunction,
  CommitStateFunction, Entry,
  PasswordEntry, PasswordManagerAllDataResponse,
} from '@/types/custom.d';
import axios from 'axios';
import generatePassword from 'password-generator';
import GenerateClient from '@/helpers/request';
import internal from 'stream';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// TODO: Set Unlocked to false after development is done
const state = {
  passwords: [],
  cards: [],
  EncryptionSettings: {
    iterations: 100000,
    encType: 'aes-256-cbc',
  },
  key: null,
  lastUnlocked: null,
  unlocked: true,
  alternativeAuth: {
    pin: false,
  },
};

interface EncryptionSettings {
  iterations: number;
  encType: string;
}

interface AlternativeAuth {
  pin: boolean;
}

interface EntryStore extends Entry {
  encrypted: boolean;
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
  EncryptionSettings: EncryptionSettings;
  key: WordArray;
  lastUnlocked: number;
  unlocked: boolean;
  alternativeAuth: AlternativeAuth;
}

interface RootState extends State {
  token: string;
  GUserID: string;
}

class Cipher {
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

function GenerateKey(password: string, salt: string, settings: EncryptionSettings): WordArray {
  return pbkdf2(password, salt, {
    keySize: 256 / 32,
    iterations: settings.iterations,
  });
}

function Encrypt(key: WordArray, plainText: WordArray, settings: EncryptionSettings) {
  const iv = WordArray.random(16);
  const encrypted = Aes.encrypt(plainText, key, {
    iv,
  });
  return new Cipher('aes-256-cbc', base64.stringify(iv), encrypted.toString());
}

function Decrypt(key: WordArray, cipher: Cipher) {
  const iv = base64.parse(cipher.iv);
  const decrypted = Aes.decrypt(cipher.ct, key, { iv });
  return decrypted.toString(utf8);
}

function ResponseParser(data: string) {
  const [encType, temp] = data.split('.');
  const [iv, ct] = data.split('|');
  return Cipher;
}

interface PasswordGeneratorOptions {
  minLength: number;
  upperCase: boolean;
  lowerCase: boolean;
  specialUse: boolean;
  nonRepeating: boolean;
}

function isStrongEnough(password: string, generatorOptions: PasswordGeneratorOptions) {
  const minLength = 18;
  const UPPERCASE_RE = /([A-Z])/g;
  const LOWERCASE_RE = /([a-z])/g;
  const NUMBER_RE = /([\d])/g;
  const SPECIAL_CHAR_RE = /([?-])/g;
  const NON_REPEATING_CHAR_RE = /([\w\d?-])\1{2,}/g;
  const uc = password.match(UPPERCASE_RE);
  const lc = password.match(LOWERCASE_RE);
  const n = password.match(NUMBER_RE);
  const sc = password.match(SPECIAL_CHAR_RE);
  const nr = password.match(NON_REPEATING_CHAR_RE);
  return password.length >= minLength && !nr && uc && lc && n && sc;
}

// TODO: Update getters & mutator for Password Manager Store.
// TODO: Add isUnlocked getter
const getters = {
  allPasswords: (state: State) => state.passwords,
  allCards: (state: State) => state.cards,
  EncryptionSettings: (state: State) => state.EncryptionSettings,
  isUnlocked: (state: State) => state.unlocked,
  key: (state: State) => state.key,
  getCardByUUID: (state: State) => (uuid: string) => {
    const entries = state.cards;
    const result: CardEntryStore = entries.filter((obj) => obj.uuid === uuid)[0];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'string' && key !== 'uuid') {
        result[key] = Decrypt(state.key, value);
      }
    }
    return result;
  },
  getPasswordByUUID: (state: State) => (uuid: string) => {
    const entries = state.passwords;
    const result: PasswordEntryStore = entries.filter((obj) => obj.uuid === uuid)[0];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'string' && key !== 'uuid') {
        result[key] = Decrypt(state.key, value);
      }
    }
    return result;
  },
};

const actions = {
  async RetrievePWManagerData({ commit }: CommitFunction, { rootState }: CommitRootStateFunction<RootState>) {
    const instance = GenerateClient(rootState.token);
    const response = await instance.get('/password-manager/data/');
    if (response.status === 401) {
      commit('AuthenticationExpired');
    } else {
      const ResponseData: PasswordManagerAllDataResponse = response.data;
      commit('SetPWData', ResponseData);
    }
  },
  // customPassword() {
  //   let password = '';
  //   const randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
  //   while (!isStrongEnough(password)) {
  //     password = generatePassword(randomLength, false, /[\w\d\?\-]/);
  //   }
  //   return password;
  // },
};

const mutations = {
  SetPWData: (state: State, PWData: PasswordManagerAllDataResponse): void => {
    const PasswordStore: PasswordEntryStore[] = PWData.data.passwords.map((x) => {
      // eslint-disable-next-line no-param-reassign
      x.name = Decrypt(state.key, x.name);
      return { encrypted: true, ...x };
    });
    const CardStore: CardEntryStore[] = PWData.data.cards.map((x) => {
      // eslint-disable-next-line no-param-reassign
      x.name = Decrypt(state.key, x.name);
      return { encrypted: true, ...x };
    });
    state.passwords = PasswordStore;
    state.cards = CardStore;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
