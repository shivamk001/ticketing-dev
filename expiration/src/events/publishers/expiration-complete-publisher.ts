import { Subjects, Publisher, ExpirationCompleteEvent } from "@shivamkesarwani001/ticketing_common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete=Subjects.ExpirationComplete;
}