import { OrderCreatedEvent, OrderStatus } from "@shivamkesarwani001/ticketing_common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose";

const setup=async ()=>{
    // create an instance of listener
    const listener=new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket=Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    });
    await ticket.save();

    // create the fake data event
    const data: OrderCreatedEvent['data']={
        id: new mongoose.Types.ObjectId().toHexString(),
        statud: OrderStatus.Created,
        userId: 'askdf',
        expiresAt: 'asjgv',
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        version: 0
    }

    // @ts-ignore
    const msg: Message={
        ack: jest.fn()
    }

    return { listener, ticket, data, msg};
}

it('sets the userId of the ticket', async ()=>{
    const { listener, ticket, data, msg}=await setup();

    await listener.onMessage(data, msg);

    const updatedTicket=await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async ()=>{
    const { listener, ticket, data, msg}=await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async ()=>{
    const { listener, ticket, data, msg}=await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    let ticketUpdatedData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);

})