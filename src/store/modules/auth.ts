import axios from 'axios';
import os from 'os';
import {
  CommitFunction,
  CommitStateFunction,
  OAuthRequestCallbackResponse,
  RefreshTokenResponse,
} from '@/types/custom.d';
import open from 'open';
/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }],
prefer-destructuring: "off" */

const DOMAIN_NAME = 'http://127.0.0.1:5000';

// TODO: change default value for authenticated to false after development is done.
const state = {
  authenticated: false,
  timeout: false,
  expired: false,
  token: '',
  GUserID: '',
  appID: '',
};

interface State {
  authenticated: boolean;
  timeout: boolean;
  expired: boolean;
  token: string;
  GUserID: string;
  appID: string;
}

const getters = {
  appID: (state: State) => state.appID,
  token: (state: State) => state.token,
  GUserID: (state: State) => state.GUserID,
  isAuthenticated: (state: State) => state.authenticated,
  timeout: (state: State) => state.timeout,
  expired: (state: State) => state.expired,
};

async function AuthenticateApp(AppID: string) {
  const hostname = os.hostname();
  const OperatingSystem = `${os.platform()}${os.arch()} ${os.release()}`;
  const request_url = new URL('/auth/login/', `${DOMAIN_NAME}`);
  request_url.searchParams.append('hostname', hostname);
  request_url.searchParams.append('app_id', AppID);
  request_url.searchParams.append('os', OperatingSystem);
  await open(request_url.toString());
}

async function CheckAppAuthenticationStatus(AppID: string) {
  const auth_check_url = new URL('/callback/app-auth/', DOMAIN_NAME);
  auth_check_url.searchParams.append('app_id', AppID);
  const CallbackResponse = await axios.get(auth_check_url.toString());
  const CallbackData: OAuthRequestCallbackResponse = CallbackResponse.data;
  return CallbackData;
}

async function RefreshAppToken(AppID: string) {
  const refresh_token_url = new URL('/refresh-token/', DOMAIN_NAME);
  const PostData = {
    app_id: AppID,
  };
  const NewTokenResponse = await axios.post(refresh_token_url.toString(), PostData);
  return NewTokenResponse.data;
}

const actions = {
  async SetupOAuth({ commit }: CommitFunction, AppID: string) {
    commit('SetAppID', AppID);
    await AuthenticateApp(AppID);
    let attempt = 0;
    const interval = setInterval(async () => {
      const callback_url = new URL('/callback/app-auth/', `${DOMAIN_NAME}`);
      callback_url.searchParams.append('app_id', AppID);
      const CallbackResponse = await axios.get(callback_url.toString());
      const CallbackData: OAuthRequestCallbackResponse = CallbackResponse.data;
      if (CallbackData.authenticated && CallbackData.success) {
        clearInterval(interval);
        commit('AppAuthenticated', CallbackData);
      }
      // if (!CallbackData.authenticated) {
      //   clearInterval(interval);
      //   return CallbackData;
      // }
      if (attempt === 700) {
        clearInterval(interval);
        commit('AuthenticationTimeout');
      }
      attempt += 1;
    }, 700);
  },
  async CheckAppAuthenticated({ commit }: CommitFunction, AppID: string) {
    commit('SetAppID', AppID);
    let response = null;
    try {
      response = await CheckAppAuthenticationStatus(AppID);
    } catch (err) {
      if (err.response.status === 401) {
        commit('AuthenticationExpired');
      }
    } finally {
      if (response) {
        commit('AppAuthenticated', response);
      }
    }
  },
  async RefreshAppToken({ commit, state }: CommitStateFunction<State>) {
    const AppID = state.appID;
    const data: RefreshTokenResponse = await RefreshAppToken(AppID);
    commit('SetToken', data.jwt);
  },
};

const mutations = {
  SetAppID: (state: State, uuid: string): void => {
    state.appID = uuid;
  },
  SetToken: (state: State, token: string): void => {
    state.token = token;
  },
  AppAuthenticated: (state: State, AuthData: OAuthRequestCallbackResponse): void => {
    state.authenticated = true;
    state.timeout = false;
    state.expired = false;
    state.GUserID = AuthData.guser_id;
    state.token = AuthData.jwt;
  },
  AuthenticationExpired: (state: State): void => {
    state.authenticated = false;
    state.timeout = false;
    state.expired = true;
  },
  AuthenticationTimeout: (state: State): void => {
    state.timeout = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
