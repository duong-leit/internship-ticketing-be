import { EventStatusEnum } from "../enums/eventStatus.enum";

export interface IEvent{
  name: string;
  eventAddress: string;
  totalTickets: number;
  categoryId: string;
  userId: string;
  ticketPrice: number;
  eventStartDate: string;
  eventEndDate: string;
  saleStartDate: string;
  saleEndDate: string;
  //availableTickets?: number;
  maxTicketOrder?: number;
  minTicketOrder?: number;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  eventPlacename?: string;
  ticketImageUrl?: string;
  organizationInfo?: string;
  organizationEmail?: string;
  organizationPhone?: string;
  organizationAddress?: string; 
  // isDelete?: boolean;
  // status?: EventStatusEnum;
}
