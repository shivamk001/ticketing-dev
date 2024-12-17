import { Publisher, Subjects, TicketUpdatededEvent } from "@shivamkesarwani001/ticketing_common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatededEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
}