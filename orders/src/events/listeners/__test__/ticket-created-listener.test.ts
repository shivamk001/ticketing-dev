import { TicketCreatedEvent } from "@shivamkesarwani001/ticketing_common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup=()=>{
    // create an instance of the listener
    const listener=new TicketCreatedListener(natsWrapper.client);

    //create a fake data object
    const data: TicketCreatedEvent['data']={
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message={
        ack: jest.fn()
    }

    return { listener, data, msg};
}

it('create and save a ticket', async ()=>{
    const {listener, data, msg}=await setup();
    //call onMessage function with the data object  + message object
    await listener.onMessage(data, msg);
    console.log('data:', data);
    // write assertions to make sure a ticket was created
    const ticket=await Ticket.findById(data.id);
    console.log(ticket);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the messages', async ()=>{
    const {listener, data, msg}=await setup();
    //call onMessage function with the data object  + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
