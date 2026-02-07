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
  first_name: string;
}

export interface UserPayload extends BaseUser {
  id?: number;
  last_name: string;
  email: string;
  password: string;
  fileId?: number;
}

export interface AuthUser extends BaseUser {
  id: number;
  access_token: string;
  role: string;
  iat: number;
  exp: number;
};

export interface UserProfile extends BaseUser {
  id: number;
  last_name: string;
  file_id: number | null;
  file_url: string | null;
  signed_url: string | null;
}

export interface DecodedUser {
  userId: string,
  email: string,
  userName: string,
  iat: number,
  exp:number
}

export interface UserApiResponse extends ApiResponse<BaseUser> { };
