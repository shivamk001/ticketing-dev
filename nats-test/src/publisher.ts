import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan=nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: "http://localhost:4222"
})

stan.on('connect', async ()=>{
    console.log('Publisher connected to NATS');

    const publisher=new TicketCreatedPublisher(stan);

    await publisher.publsh({
        id: '123',
        title: 'concert',
        price: 20
    });
})