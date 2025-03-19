import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@shivamkesarwani001/ticketing_common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
    queueGroupName: string=queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        const order=await Order.findById(data.id);

        if(!order){
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        msg.ack();
    }
}