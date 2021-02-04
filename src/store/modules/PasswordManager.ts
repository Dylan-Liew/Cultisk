const pbkdf2 = require('pbkdf2');
const aesjs = require('aes-js');
const crypto = require('crypto');
/* eslint no-shadow: ["error", { "allow": ["state"] }] */

const state = {
  passwords: [],
  cards: [],
  KeySettings: {
    iterations: 10000,
    digest: 'sha512',
    keylen: 256,
  },
  key: '',
  expiry: null,

};

interface KeySettings {
  iterations: number;
  digest: string;
  keylen: number;
}

function GenerateKey(password: string, settings: KeySettings) {
}

async function Encrypt(key: Buffer, plainText: string) {
}

const getters = {
};

const actions = {
};

const mutations = {
};

export default {
  state,
  getters,
  actions,
  mutations,
};
