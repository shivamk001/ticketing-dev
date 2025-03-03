import { Publisher, OrderCancelledEvent, Subjects } from "@shivamkesarwani001/ticketing_common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
}