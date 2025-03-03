import { Publisher, OrderCreatedEvent, Subjects } from "@shivamkesarwani001/ticketing_common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
}

