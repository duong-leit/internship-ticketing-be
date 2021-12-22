import { Injectable } from '@nestjs/common';
import { generateBtcWallet } from '@tatumio/tatum';

@Injectable()
export class TatumService {
  async generateWallet(mnemonic: string) {
    return await generateBtcWallet(true, mnemonic);
  }
}
