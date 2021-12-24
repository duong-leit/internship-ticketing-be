import { Injectable } from '@nestjs/common';
import { AxiosService } from './axios.sesrvice';
import * as FormData from 'form-data';
import {
  IMetadata,
  IMetadataResponse,
  IMintData,
  IMintResponse,
  ITransfer,
} from '../infrastructure/interfaces/tatum.interface';

@Injectable()
export class TatumService {
  constructor(private axiosService: AxiosService) {}
  async generateWallet() {
    const result = await this.axiosService.get('v3/flow/wallet');
    return { mnemonic: result.mnemonic, xpub: result.xpub };
  }

  async generateAddress(xpub: string): Promise<string> {
    const result = await this.axiosService.get(`v3/flow/address/${xpub}/1`);

    return result.address;
  }

  async generatePrivateKey(mnemonic: string, index = 1): Promise<string> {
    const result = await this.axiosService.post(`v3/flow/wallet/priv`, {
      mnemonic: mnemonic,
      index: index,
    });

    return result.key;
  }

  async deloySmartContract(
    account: string,
    privateKey: string,
    chain = 'FLOW'
  ): Promise<string> {
    const result = await this.axiosService.post(`v3/nft/deploy`, {
      account,
      privateKey,
      chain,
    });
    const contract = await this.axiosService.get(
      `v3/nft/address/${chain}/${result.txId}`
    );

    return contract.contractAddress;
  }

  async uploadMetadata(
    metadata: IMetadata,
    filename: string
  ): Promise<IMetadataResponse> {
    const payload = JSON.stringify(metadata);
    const bufferObject = Buffer.from(payload, 'utf-8');
    const file = new FormData();

    file.append('file', bufferObject, `${filename}.json`);

    const result = await this.axiosService.post(
      `v3/ipfs`,
      file,
      file.getHeaders()
    );
    const urlMetadata = `ipfs://${result.ipfsHash}/${filename}.json`;

    return { ...result, urlMetadata };
  }

  async mintNFT(data: IMintData): Promise<IMintResponse> {
    const result: IMintResponse = await this.axiosService.post(
      'v3/nft/mint',
      data
    );

    return result;
  }

  async transferTicket(data: ITransfer): Promise<string> {
    const sellerAddress = await this.generateAddress(data.xpubSeller);
    const buyerAddress = await this.generateAddress(data.xpubBuyer);

    const sellerKey = await this.generatePrivateKey(data.mnemonicSeller);

    const contractAddress = await this.deloySmartContract(
      sellerAddress,
      sellerKey
    );

    const { urlMetadata } = await this.uploadMetadata(
      data.metadata,
      sellerAddress
    );

    const mintNFTData: IMintData = {
      to: buyerAddress,
      account: sellerAddress,
      privateKey: sellerKey,
      contractAddress: contractAddress,
      url: urlMetadata,
      chain: 'FLOW',
    };

    const result = await this.mintNFT(mintNFTData);

    return result.txId;
  }
}
