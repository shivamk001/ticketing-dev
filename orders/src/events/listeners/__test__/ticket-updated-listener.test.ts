import mongoose, { set } from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { TicketCreatedEvent } from "@shivamkesarwani001/ticketing_common";
import { Message } from "node-nats-streaming";

const setup=async ()=>{
    // create a listener
    const listener=new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket=Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    // create a fake data object
    const data: TicketCreatedEvent['data']={
        id: ticket.id,
        version: ticket.version+1,
        title: 'new concert',
        price: 999,
        userId: 'abcd'
    };

    // create afake msg object
    //@ts-ignore
    const msg: Message={
        ack: jest.fn()
    }

    return {msg, data, ticket, listener}
}

it('finds, upates and saves a ticket', async ()=>{
    const { msg, data, ticket, listener}=await setup();

    await listener.onMessage(data, msg);

    const updatedTicket=await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async ()=>{
    const {msg, data, listener}=await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async ()=>{
    const {msg, data, listener}=await setup();

    data.version=10;

    try{
        await listener.onMessage(data, msg);
    }catch(err){}

    expect(msg.ack).not.toHaveBeenCalled()
})