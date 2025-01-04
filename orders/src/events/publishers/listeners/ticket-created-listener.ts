import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@shivamkesarwani001/ticketing_common";
import { Ticket } from "../../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'orders-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        
    }
}