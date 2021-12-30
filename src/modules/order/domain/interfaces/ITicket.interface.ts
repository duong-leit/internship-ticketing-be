export interface ICreateOrderDetails {
  amount: number;
  orderId: string;
  sellerId: string;
  buyerId: string;
  ticketImage: string;
}
export interface ITransferTicket {
  orderId: string;
  amount: number;
  eventId: string;
}
