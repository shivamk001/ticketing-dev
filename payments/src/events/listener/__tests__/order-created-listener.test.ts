import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@shivamkesarwani001/ticketing_common";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup=async ()=>{
    const listener=new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data']={
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'abcd',
        userId: 'abcd',
        statud: OrderStatus.Created,
        ticket:{
            id: 'abcd',
            price: 0
        }
    }

    // @ts-ignore
    const msg: Message={
        ack: jest.fn()
    }

    return { listener, data, msg};
}

it('replicates the order info', async ()=>{
    const {listener, data, msg}=await setup();

    await listener.onMessage(data, msg);

    const order=await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
})

it('acks the message', async ()=>{
    const {listener, data, msg}=await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})