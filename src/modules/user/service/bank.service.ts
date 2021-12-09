import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankRepository } from '../infrastructure/bank.repository';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(BankRepository)
    private readonly bankRepository: BankRepository
  ) {}

  async getOneBank(
    data: { [key: string]: string | number } | undefined = undefined,
  ) {
    const user = await this.bankRepository.findOne({
      where: {
        ...data,
      },
    });

    return {
      statusCode: 200,
      data: user,
    };
  }

  async createBank() {
    const user = {
      userId: '49931a5e-8f15-40e9-ac99-e8cd216e839d',
      name: 'khoa',
    };
    const data = {
      name: 'Viettinbank',
      cardHolderName: 'Ha Anh Khoa',
      creditNumber: '1231 2312 3213',
    };

    const bank = await this.bankRepository.save({
      name: data.name,
      userId: user.userId,
      cardHolderName: data.cardHolderName,
      creditNumber: data.creditNumber,
    });

    if (!bank) return { statusCode: 400, message: 'Server Error' };
    return {
      statusCode: 201,
      message: 'Create bank successful',
    };
  }
}
