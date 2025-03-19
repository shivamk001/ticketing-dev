import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@shivamkesarwani001/ticketing_common";
import { queueGroupName } from "../queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import mongoose, { version } from "mongoose";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
    queueGroupName: string=queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        
        const order=await Order.findOne({
            _id: data.id,
            version: data.version-1
        });

        if(!order){
            throw new Error('Order not found');
        }

        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }   
}