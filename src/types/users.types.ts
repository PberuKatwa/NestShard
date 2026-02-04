export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string;
  signedUrl?: string;
}

export interface DecodedUser {
  userId: string,
  email: string,
  userName: string,
  iat: number,
  exp:number
}
