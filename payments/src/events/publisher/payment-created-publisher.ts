import { Subjects, Publisher, PaymentCreatedEvent } from "@shivamkesarwani001/ticketing_common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
}