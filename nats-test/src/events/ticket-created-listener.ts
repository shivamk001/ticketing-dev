import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated=Subjects.TicketCreated;
    queueGroupName: string='payments-service';

    onMessage(data: any, msg: Message): void {
        console.log('Event Data!', data);
        msg.ack();
    }
}