export interface property {
  id: number;
  name: string;
  price: number;
  is_rental: boolean;
  image_url: string;
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
