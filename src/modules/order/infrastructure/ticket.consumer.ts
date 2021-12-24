import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { IMetadata } from 'src/modules/share/infrastructure/interfaces/tatum.interface';
import { TatumService } from 'src/modules/share/service/tatum.service';
import { WalletService } from 'src/modules/user/service/wallet.service';
import { OrderDetailRepository } from './repositories/orderDetail.repository';

@Processor('generate-ticket-token')
export class GenerateTicketConsumer {
  constructor(
    private orderDetailRepository: OrderDetailRepository,
    private walletService: WalletService,
    private tatumService: TatumService
  ) {}
  @Process('generate')
  async generate(
    job: Job<{
      orderId: string;
      orderDetailId: string;
      sellerId: string;
      ticketImage: string;
      buyerId: string;
    }>
  ) {
    // try {
    const walletFrom = await this.walletService.getWallet(job.data.sellerId);
    const walletTo = await this.walletService.getWallet(job.data.buyerId);
    const xpubSeller = walletFrom.walletAddress;
    const mnemonicSeller = walletFrom.mnemonic;
    const xpubBuyer = walletFrom.walletAddress;

    const metadata: IMetadata = {
      sellerId: walletFrom.userId,
      buyerId: walletTo.userId,
      ticketImage: job.data.ticketImage,
    };
    const NFTToken = await this.tatumService.transferTicket({
      xpubBuyer,
      xpubSeller,
      mnemonicSeller,
      metadata: metadata,
    });

    await this.orderDetailRepository.update(
      { orderId: job.data.orderId, id: job.data.orderDetailId },
      { nftToken: NFTToken }
    );
    // } catch (error) {
    //   console.log('generate-ticket-token', error);
    // }
  }
}
