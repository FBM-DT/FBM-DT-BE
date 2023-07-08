export interface IAuthAccess {
  authorization?: string;
  accept?: string;
  host?: string;
  connection?: string;
}

export interface IAuthPayload {
  accountId: number;
  fullname: string;
  phonenumber: string;
  role: string;
}
