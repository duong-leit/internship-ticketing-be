import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class AppBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @CreateDateColumn({ name: 'createdAt' })
  'createdAt'!: string;
  @UpdateDateColumn({ name: 'updatedAt' })
  'updatedAt'!: string;
}
