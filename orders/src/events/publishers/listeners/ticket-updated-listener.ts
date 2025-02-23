import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatededEvent } from "@shivamkesarwani001/ticketing_common";
import { Ticket } from "../../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatededEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketUpdatededEvent['data'], msg: Message): Promise<void> {
        const {id, title, price}=data;
        const ticket=await Ticket.findById(id);

        if(!ticket){
            throw new Error('Ticket Not Found');
        }

        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }

}