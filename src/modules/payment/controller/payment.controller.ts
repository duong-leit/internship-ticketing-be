import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { OrderRequestDto } from '../dto/payment.dto';
import { Connection } from 'typeorm';
import { transferResponse } from 'src/common/utils/transferResponse';
import { Response } from 'express';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';

@ApiTags('Payment')
@ApiBearerAuth()
@Roles(RoleEnum.User)
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private connection: Connection
  ) {}

  @Post()
  @ApiBody({ type: OrderRequestDto })
  async checkoutTickets(
    @Req() req,
    @Body() data: OrderRequestDto,
    @Res() res: Response
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderId = await this.paymentService.handleCheckout(
        {
          ...data,
          userId: req.user.userId,
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
