import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@shivamkesarwani001/ticketing_common";
import { Ticket } from "../../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        
    }
}