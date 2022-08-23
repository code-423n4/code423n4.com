export interface UserFileData {
  handle: string;
  link?: string;
  image?: string;
  members?: string[];
}

export interface UserData extends UserFileData {
  imageUrl?: string;
}

export interface TeamData extends UserFileData {
  members: string[];
  imageUrl?: string;
  address?: string;
}
