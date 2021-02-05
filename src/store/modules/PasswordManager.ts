import pbkdf2 from 'crypto-js/pbkdf2';
import Aes from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import WordArray from 'crypto-js/lib-typedarrays';
import {
  CardEntry,
  CommitFunction, CommitRootStateFunction,
  CommitStateFunction, Entry,
  PasswordEntry, PasswordManagerAllDataResponse,
} from '@/types/custom.d';
import axios from 'axios';
import generatePassword from 'password-generator';
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  passwords: [],
  cards: [],
  KeySettings: {
    iterations: 10000,
  },
  key: null,
  expiry: null,

};

interface KeySettings {
  iterations: number;
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
  KeySettings: KeySettings;
  key: WordArray;
  expiry: number;
}

interface RootState extends State {
  token: string;
}

function GenerateKey(password: string, settings: KeySettings): WordArray {
  return pbkdf2(password, '', {
    keySize: 256 / 32,
    iterations: settings.iterations,
  });
}

function Encrypt(key: WordArray, plainText: WordArray) {
  const encrypted = Aes.encrypt(plainText, key);
  return encrypted.toString();
}

function Decrypt(key: WordArray, cipherText: string) {
  const decrypted = Aes.decrypt(cipherText, key);
  return decrypted.toString(utf8);
}

function GenerateClient(jwt: string) {
  return axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
      post: {
        authorization: `Bearer ${jwt}`,
      },
    },
  });
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

const getters = {
  allPasswords: (state: State) => state.passwords,
  allCards: (state: State) => state.cards,
  KeySettings: (state: State) => state.KeySettings,
  key: (state: State) => state.key,
  expiry: (state: State) => state.expiry,
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
