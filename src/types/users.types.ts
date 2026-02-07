import type { ApiResponse } from "./api.types";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  fileId: number;
  access_token?: string;
  signedUrl?: string;
}

export interface BaseUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  fileId: number;
  access_token?: string;
  signedUrl?: string;
}

export interface DecodedUser {
  userId: string,
  email: string,
  userName: string,
  iat: number,
  exp:number
}

export interface UserApiResponse extends ApiResponse<User> { };
