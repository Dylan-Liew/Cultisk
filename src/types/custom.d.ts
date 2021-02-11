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

export interface AVInfo{
  FilePath: string;
  malicious: boolean;
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

export interface CommitRootStateFunction<X> extends CommitFunction {
  rootState: X;
}

export interface CommitRootSateStateFunction<T, X> extends CommitStateFunction<T> {
  rootState: X;
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

export interface Entry {
  [index: string];
  uuid: string;
  name: string;
  type: string;
  favorite: boolean;
  deleted: boolean;
}

export interface PasswordEntry extends Entry {
  username: string;
  password: string;
  totp_secret?: string;
  note?: string;
  url?: string;
}

export interface CardEntry extends Entry {
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

export interface PasswordManagerAllDataResponse extends ServerResponse {
  data: PasswordManagerData;
}

export interface PasswordManagerUpdateResponse extends ServerResponse {
  data?: CardEntry | PasswordEntry;
}

export interface SpamFilterData {
  sender: string;
  message: string;
  subject: string;
}

export interface SpamFilterDataResponse extends ServerResponse {
  data: SpamFilterData[];
}

export interface ProtectedSymmetricKeyResponse extends ServerResponse {
  data: string;
}
