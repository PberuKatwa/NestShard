export interface Property {
  id: number;
  name: string;
  price: number;
  isRental: boolean;
  imageUrl: string;
  location: string;
  description: string;
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
