import { Commit } from 'vuex';
import { Server } from 'vue-cli-plugin-electron-builder';

export declare module 'vue-material/dist/components';

export interface SoftwareInfo {
  name: string;
  version: string;
  publisher: string;
  title: string;
  link: string;
  lat_version: string;
  download_link: string;
}

export interface ScanResultObj {
    mal_detected: number;
    files_scanned: number;
    scanned_list: object;
}

export interface CommitFunction {
    commit: Commit;
}

export interface CommitStateFunction<T> extends CommitFunction {
    state: T;
}

export interface ServerResponse {
  success: boolean;
}

export interface OAuthRequestCallbackResponse extends ServerResponse {
  authenticated: boolean;
  jwt: string;
  guser_id: string;
}

export interface RefreshTokenResponse extends ServerResponse {
  authenticated: boolean;
  jwt: string;
}

interface Entry {
  [index: string];
  uuid: string;
  type: string;
  favorite: boolean;
  deleted: boolean;
}

export interface PasswordEntry extends Entry {
  username: string;
  password: string;
  totp_secret?: string;
  url?: string;
}

export interface CardEntry extends Entry {
  name: string;
  brand: string;
  number: string;
  ccv: string;
  expiry_month: string;
  expiry_year: string;
}

export interface PasswordManagerData {
  [index: string];
  cards: CardEntry[];
  passwords: PasswordEntry[];
}

export interface PasswordManagerServerResponse extends ServerResponse {
  data: PasswordManagerData | PasswordEntry | CardEntry;
}
