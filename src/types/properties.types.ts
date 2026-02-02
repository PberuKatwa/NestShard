export interface Property < T = string > {
  id: number;
  name: string;
  price: number;
  isRental: boolean;
  imageUrl: string;
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
