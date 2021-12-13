export interface ICreateTicket {
  userId: string;
  amount: number;
  eventId: string;
}
export interface ITransferTicket {
  orderId: string;
  amount: number;
  eventId: string;
}
