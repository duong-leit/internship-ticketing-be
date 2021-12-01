import { AppBaseEntity } from "src/common/entities/entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity('TicketDetail')
export class TicketDetailEntity extends AppBaseEntity{
    @Column({type: 'varchar', length: 510, nullable: false})
    nftToken: string;

    @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.id)
    order: OrderEntity
}