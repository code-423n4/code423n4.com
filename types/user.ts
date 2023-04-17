import {
  AbsoluteURL,
  FindingBody,
  RelativeURL,
  SupportedChain,
  UserId,
  Username,
  WalletAddress,
} from "./shared";

export interface UserFileData {
  handle: string;
  moralisId?: UserId;
  link?: AbsoluteURL;
  image?: RelativeURL;
}

export interface UserData extends UserFileData {
  imageUrl?: AbsoluteURL;
}

export interface BotFileData extends UserFileData {
  crew: Username[];
  paymentAddresses: {
    chain: SupportedChain;
    address: WalletAddress;
  }[];
}

export interface BotData extends UserData, BotFileData {}

export interface TeamData extends UserData {
  members: Username[];
  paymentAddresses: PaymentAddress[];
}

export interface PaymentAddress {
  address: WalletAddress;
  chain: SupportedChain;
  id?: string;
}

export interface TeamCreateRequest {
  teamName: string;
  members: Username[];
  polygonAddress: WalletAddress;
  ethereumAddress?: WalletAddress;
  link?: AbsoluteURL;
  image?: RelativeURL;
}

export interface BotCreateRequest {
  botName: string;
  crewMembers: Username[];
  description: string;
  submission: FindingBody;
  polygonAddress: WalletAddress;
  ethereumAddress?: WalletAddress;
  image?: RelativeURL;
}

export interface TeamUpdateRequest {
  teamName: string;
  members: {
    oldValue: Username[];
    newValue: Username[];
  };
  polygonAddress: {
    oldValue: WalletAddress;
    newValue: WalletAddress;
  };
  ethereumAddress?: {
    oldValue: WalletAddress;
    newValue: WalletAddress;
  };
  link?: {
    oldValue: AbsoluteURL;
    newValue: AbsoluteURL;
  };
  image?: RelativeURL;
}

export interface TeamDeleteRequest {
  teamName: string;
}
