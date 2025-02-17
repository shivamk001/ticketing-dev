import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@shivamkesarwani001/ticketing_common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated=Subjects.TicketCreated;
    queueGroupName: string=queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        console.log('IN ONMESSAGE');
        
        const {id, title, price}=data;
        const ticket=Ticket.build({
            id, title, price
        });
        console.log('TICKET IN ONMESSAGE', ticket);
        await ticket.save();
        msg.ack();
    }
}