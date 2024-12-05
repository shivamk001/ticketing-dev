import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest, NotAuthorizedError, NotFoundError } from '@shivamkesarwani001/ticketing_common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router=express.Router();

router.put('/api/tickets/:id', 
        requireAuth,
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
        // console.log('HI');

        const ticket=await Ticket.findById(req.params.id);
        if(!ticket)
                throw new NotFoundError();

        if(ticket.userId !== req.currentUser?.id)
                throw new NotAuthorizedError()

        ticket.set({
                title: req.body.title,
                price: req.body.price
        });

        await ticket.save();

        new TicketCreatedPublisher(natsWrapper.client)
        .publsh({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId
        });

        res.send(ticket);
})

export { router as updateTicketRouter };