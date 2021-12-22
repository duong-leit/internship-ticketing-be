import { AutoMap } from '@automapper/classes';

export class OrderDetailDto {
  @AutoMap()
  id: string;

  @AutoMap()
  nftToken: string;
}
