import { Injectable } from '@nestjs/common';
// import { generateBtcWallet, Currency } from '@tatumio/tatum';
import { TatumService } from 'src/modules/share/service/tatum.service';
import { WalletRepository } from '../infrastructure/wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    private readonly tatumService: TatumService,
    private walletRepository: WalletRepository
  ) {}

  async createWallet(userId: string) {
    const { mnemonic, xpub } = await this.tatumService.generateWallet(userId);
    const wallet = this.walletRepository.save({
      mnemonic,
      walletAddress: xpub,
      userId,
    });
    return wallet;
  }
}
