export interface UserFileData {
  handle: string;
  moralisId: string;
  link?: string;
  image?: string;
}

export interface UserData extends UserFileData {
  imageUrl?: string;
}

export interface TeamData extends UserFileData {
  members: string[];
  imageUrl?: string;
  address?: string;
}

export interface PaymentAddress {
  address: string;
  chain: string;
  id: string;
}
