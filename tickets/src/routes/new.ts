import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest, TicketCreatedEvent } from '@shivamkesarwani001/ticketing_common';

import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router=express.Router();

router.post('/api/tickets', requireAuth, 
    [
        body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
        body('price')
        .isFloat({gt: 0})
        .withMessage('Price must be greater than 0')
    ],
    validationRequest,
    async (req: Request, res: Response)=>{
        const {title, price}=req.body;

        const ticket=Ticket.build({
            title, 
            price,
            userId: req.currentUser!.id
        })

        await ticket.save();

        console.log('New Ticket:', ticket);

        let publishData: TicketCreatedEvent['data']={
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        }

        try{
        await new TicketCreatedPublisher(natsWrapper.client)
            .publish(publishData);
        }
        catch(err){
            console.error(`Error in publishing ${err}`);
        }
        res.status(201).send(ticket);
})

export { router as createTicketRouter};