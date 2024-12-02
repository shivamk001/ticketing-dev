import { Publisher, Subjects, TicketCreatedEvent } from "@shivamkesarwani001/ticketing_common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated=Subjects.TicketCreated;
}