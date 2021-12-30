import { EntityRepository, Repository } from 'typeorm';
import { BankEntity } from '../domain/entities/bank.entity';

@EntityRepository(BankEntity)
export class BankRepository extends Repository<BankEntity> {}
