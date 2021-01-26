interface EventObj {
  [index: string];
  id: number;
  favorite: boolean;
  deleted: boolean;
}
interface NoteObj extends EventObj {
  content: string;
}

interface PasswordObj extends EventObj {
  username: string;
  password: string;
  totp_secret?: string;
  url?: string;
}

interface CardObj extends EventObj {
  number: string;
  ccv: string;
  expiry_month: number;
  expiry_year: number;
}

interface PasswordManagerData {
  [index: string];
  notes: NoteObj[];
  cards: CardObj[];
  passwords: PasswordObj[];
}

declare namespace NodeJS {
  interface Global {
    LastPasswordManagerData: PasswordManagerData;
  }
}

interface RPCResponse {
  success: boolean;
  error_code?: string;
  error_message?: string;
  data?: PasswordManagerData | PasswordObj | NoteObj | CardObj ;
  deleted?: boolean;
}

interface ScanResultObj {
    mal_detected: number;
    files_scanned: number;
    scanned_list: list;
}
