export interface IMetadata {
  sellerId: string;
  buyerId: string;
  ticketImage: string;
}

export interface IMetadataResponse {
  ipfsHash: string;
  urlMetadata: string;
}

export interface IMintData {
  to: string;
  account: string;
  privateKey: string;
  contractAddress: string;
  url: string;
  chain: string;
}

export interface IMintResponse {
  tokenId: string;
  txId: string;
}

export interface ITransfer {
  xpubBuyer: string;
  xpubSeller: string;
  mnemonicSeller: string;
  metadata: IMetadata;
}
