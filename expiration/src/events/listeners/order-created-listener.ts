import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@shivamkesarwani001/ticketing_common";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName: string=this.queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        
    }
}