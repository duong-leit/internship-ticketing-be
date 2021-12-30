import { EntityRepository, Repository } from 'typeorm';
import { WalletEntity } from '../domain/entities/wallet.entity';

@EntityRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {}
