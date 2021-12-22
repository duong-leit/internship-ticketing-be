import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  mnemonic!: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  walletAddress!: string;

  @Column({ type: 'uuid', name: 'userId' })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
