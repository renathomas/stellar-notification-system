export interface AccountInfo {
  publicKey: string;
  chain: string;
}

export interface User {
  id: string;
  username: string;
  accountInfos: AccountInfo[];
}
  