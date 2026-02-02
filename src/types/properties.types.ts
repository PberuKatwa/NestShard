import type { ApiResponse } from "./api.types";

export interface Property<T = string> {
  id: number;
  name: string;
  price: number;
  isRental: boolean;
  image_url: string;
  location: string;
  description: string;
  signedUrl?:T
}

export interface PropertyPayload {
  userId: number;
  name: string;
  price: number;
  isRental: boolean;
  imageUrl: string;
  location: string;
  description: string;
}

export interface AllProperties {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PropertyResponse extends ApiResponse<AllProperties> { };
