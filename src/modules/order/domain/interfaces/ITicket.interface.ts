export interface ICreateOrderDetails {
  amount: number;
  orderId: string;
}
export interface ITransferTicket {
  orderId: string;
  amount: number;
  eventId: string;
}
