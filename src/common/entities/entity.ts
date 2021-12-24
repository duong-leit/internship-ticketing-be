import { AutoMap } from '@automapper/classes';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AppBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id!: string;

  @CreateDateColumn({ name: 'createdAt' })
  @AutoMap()
  'createdAt'!: string;

  @UpdateDateColumn({ name: 'updatedAt' })
  'updatedAt'!: string;
}
