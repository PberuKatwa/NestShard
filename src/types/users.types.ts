export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  signedUrl?: string;
}

export interface DecodedUser {
  userId: string,
  email: string,
  userName: string,
  iat: number,
  exp:number
}
