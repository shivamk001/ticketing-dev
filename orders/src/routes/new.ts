import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validationRequest } from '@shivamkesarwani001/ticketing_common';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-cancelled-publisher';

const router=express.Router();

const EXPIRATION_WINDOW_SECONDS=15*60;

router.post('/api/orders', 
            requireAuth,
            [
                body('ticketId')
                .not()
                .isEmpty()
                .custom((input: string)=>mongoose.Types.ObjectId.isValid(input))
                .withMessage('TicketId must be provided')
            ],
            validationRequest,
            async (req: Request, res: Response)=>{
                // find the ticket the user is trying to order in the db
                const {ticketId}=req.body;
                const ticket=await Ticket.findById(ticketId);

                if(!ticket){
                    throw new NotFoundError();
                }
                
                // make sure that this ticket is not already reserved
                const isReserved=await ticket.isReserved();
                if(isReserved){
                    throw new BadRequestError('Ticket is already reserved');
                }

                // calculate an exp date for this order
                const expiration=new Date();
                expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_SECONDS);

                // build the order and save to db
                const order=Order.build({
                    userId: req.currentUser!.id,
                    status: OrderStatus.Created,
                    expiresAt: expiration,
                    ticket
                })
                await order.save();

                // publish an event saying that an order was created
                new OrderCreatedPublisher(natsWrapper.client)
                    .publish({
                        id: order.id,
                        version: order.version,
                        statud: order.status,
                        userId: order.userId,
                        expiresAt: order.expiresAt.toISOString(),
                        ticket:{
                            id: ticket.id,
                            price: ticket.price
                        }
                    })


                res.status(201).send(order);
})

export { router as newOrderRouter };