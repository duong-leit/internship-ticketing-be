import { Body, Controller, Post, Res } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { OrderRequestDto } from '../dto/payment.dto';
import { Connection } from 'typeorm';
import { transferResponse } from 'src/common/utils/transferResponse';
import { Response } from 'express';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';
import { Roles } from 'src/modules/auth/roles.decorator';

@ApiTags('Payment')
@Roles(RoleEnum.User)
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private connection: Connection
  ) {}

  @Post()
  @ApiBody({ type: OrderRequestDto })
  async checkoutTickets(@Body() data: OrderRequestDto, @Res() res: Response) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderId = await this.paymentService.handleCheckout(
        {
          ...data,
        },
        queryRunner
      );
      queryRunner.commitTransaction();
      transferResponse(res, { statusCode: 200, data: orderId });
    } catch (error) {
      console.log(error);
      queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
