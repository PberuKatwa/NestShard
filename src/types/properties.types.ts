import type { ApiResponse } from "./api.types";

export interface Property<T = string> {
  id: number;
  name: string;
  price: number;
  is_rental: boolean;
  image_url: string;
  fileId: number;
  location: string;
  description: string;
  signedUrl?: T;
  status?: T;
}

export interface PropertyPayload {
  userId: number;
  name: string;
  price: number;
  isRental: boolean;
  fileId: number;
  location: string;
  description: string;
}

export interface AllProperties {
  properties: Property[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
}

export interface PropertyApiResponse extends ApiResponse<AllProperties> { };
