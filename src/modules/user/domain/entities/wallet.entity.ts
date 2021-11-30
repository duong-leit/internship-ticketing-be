import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  walletAddress!: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user!: UserEntity;
}
