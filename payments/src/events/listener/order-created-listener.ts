import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@shivamkesarwani001/ticketing_common";
import { queueGroupName } from "../queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName: string=queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const order=Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.statud,
            userId: data.userId,
            version: data.version
        });

        await order.save();

        msg.ack();
    }
}