export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface DecodedUser {
  userId: string,
  email: string,
  userName: string,
  iat: number,
  exp:number
}
