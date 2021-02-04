import pbkdf2 from 'crypto-js/pbkdf2';
import WordArray from 'crypto-js/lib-typedarrays';
import { parse, stringify } from 'crypto-js/enc-utf8';
import { CardEntry, PasswordEntry } from '@/types/custom';
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

interface State {
  passwords: PasswordEntry[];
  cards: CardEntry[];
  KeySettings: KeySettings;
  key: WordArray;
  expiry: number;
}

function GenerateKey(password: string, settings: KeySettings): WordArray {
  return pbkdf2(password, '', {
    keySize: 256 / 32,
    iterations: settings.iterations,
  });
}

async function Encrypt(key: WordArray, plainText: WordArray) {
  return CryptoJS.AES.encrypt(plainText, key);
}

const getters = {
  allPasswords: (state: State) => state.passwords,
  allCards: (state: State) => state.cards,
  KeySettings: (state: State) => state.KeySettings,
  key: (state: State) => state.key,
  expiry: (state: State) => state.expiry,
};

const actions = {
};

const mutations = {
  SetPWData: (state: State, PWData): void => {

  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
