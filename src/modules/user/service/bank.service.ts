import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from '../domain/entities/bank.entity';
import { BankRequestDto } from '../dto/bank.dto';
import { BankRepository } from '../infrastructure/bank.repository';

@Injectable({ scope: Scope.REQUEST })
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

  async getBanks(
    userId: string,
    paging: { pageSize?: number; pageIndex?: number } | undefined
  ) {
    if (!userId) return { error: true, message: 'User is invalid' };

    if (!paging) {
      const result = await this.bankRepository.find({ userId });
      return {
        data: result,
      };
    }
    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex * take : 0;

    const [result, total] = await this.bankRepository.findAndCount({
      where: { userId: userId },
      take,
      skip,
    });
    return {
      data: result,
      pagination: {
        totalPage: Math.ceil(total / take),
        pageIndex: take,
        pageSize: skip / take,
      },
    };
  }

  async createBank(
    userId: string,
    bankInfo: BankRequestDto
  ): Promise<
    Promise<BankEntity> | Promise<{ error: boolean; message: string }>
  > {
    const bank: BankEntity = await this.bankRepository.save({
      name: bankInfo.name,
      userId: userId,
      cardHolderName: bankInfo.cardHolderName,
      creditNumber: bankInfo.creditNumber,
    });

    if (!bank) return { error: true, message: 'Server Error' };
    return bank;
  }
}
