import type { ApiResponse } from "./api.types";

export interface Property {
  id: number;
  name: string;
  price: number;
  is_rental: boolean;
  file_url: string | null;
  fileId: number | null;
  location: string;
  description: string;
  signedUrl: string | null;
  status?: string;
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
export interface SinglePropertyApiResponse extends ApiResponse<Property> { };
