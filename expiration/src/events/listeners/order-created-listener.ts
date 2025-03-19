import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@shivamkesarwani001/ticketing_common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName: string=this.queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {

        const delay=new Date(data.expiresAt).getTime()-new Date().getTime();

        console.log('ORDER CREATED LISTENER', delay, new Date().toDateString());
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        });

        msg.ack();
    }
}