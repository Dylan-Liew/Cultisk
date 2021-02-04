import { Commit } from 'vuex';
import { Server } from 'vue-cli-plugin-electron-builder';

export declare module 'vue-material/dist/components';
interface Entry {
  [index: string];
  id: number;
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
  brand: 'Visa' | 'Mastercard' | 'Amex';
  number: string;
  ccv: string;
  expiry_month: number;
  expiry_year: number;
}

export interface PasswordManagerData {
  [index: string];
  notes: NoteObj[];
  cards: CardEntry[];
  passwords: PasswordEntry[];
}

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

export interface PasswordManagerDataResponse extends ServerResponse {
  data: PasswordManagerData | PasswordEntry | NoteObj | CardEntry;
}
