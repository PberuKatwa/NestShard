import type { ApiResponse } from "./api.types";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  access_token?: string;
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

export interface LoginUserResponse extends ApiResponse<User> { };
