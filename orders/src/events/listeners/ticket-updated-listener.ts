import { Listener, Subjects, TicketUpdatededEvent } from "@shivamkesarwani001/ticketing_common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatededEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
    queueGroupName: string=queueGroupName;
    async onMessage(data: TicketUpdatededEvent['data'], msg: Message): Promise<void> {
        const ticket=await Ticket.findByEvent(data);
        
        if(!ticket){
            throw new Error('Ticket Not Found');
        }

        const {title, price}=data;
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }
}