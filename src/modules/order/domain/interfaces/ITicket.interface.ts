export interface ICreateOrderDetails {
  // userId: string;
  amount: number;
  orderId: string;
}
export interface ITransferTicket {
  orderId: string;
  amount: number;
  eventId: string;
}
