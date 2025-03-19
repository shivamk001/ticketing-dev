import { Listener, OrderCancelledEvent, Subjects } from "@shivamkesarwani001/ticketing_common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
    queueGroupName: string=queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const ticket=await Ticket.findById(data.ticket.id);
        console.log('In OrderCancelled Publisher1:', ticket);
        if(!ticket){
            throw new Error('Ticket not found');
        }

        ticket.set({orderId: undefined});

        await ticket.save();

        console.log('In OrderCancelled Publisher2:', ticket);
        await new TicketUpdatedPublisher(this.client)
        .publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}