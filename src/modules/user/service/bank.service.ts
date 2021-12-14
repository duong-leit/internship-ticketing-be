import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner } from 'typeorm';
import { BankEntity } from '../domain/entities/bank.entity';
import { BankRequestDto } from '../dto/bank.dto';
import { BankRepository } from '../infrastructure/bank.repository';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(BankRepository)
    private readonly bankRepository: BankRepository
  ) {}

  async getBank(
    data: { [key: string]: string | number } | undefined = undefined
  ) {
    const user = await this.bankRepository.findOne({
      where: { ...data },
    });
    return { statusCode: 200, data: user };
  }

  async createBank(
    bankInfo: BankRequestDto,
    queryRunner: QueryRunner = undefined
  ): Promise<BankEntity> {
    let bank: BankEntity;
    if (queryRunner === undefined) {
      bank = await this.bankRepository.save({
        name: bankInfo.name,
        userId: bankInfo.userId,
        cardHolderName: bankInfo.cardHolderName,
        creditNumber: bankInfo.creditNumber,
      });
    } else {
      bank = await queryRunner.manager.save(BankEntity, {
        name: bankInfo.name,
        userId: bankInfo.userId,
        cardHolderName: bankInfo.cardHolderName,
        creditNumber: bankInfo.creditNumber,
      });
    }
    return bank;
  }
}
