import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest, NotAuthorizedError, NotFoundError } from '@shivamkesarwani001/ticketing_common';
import { Ticket } from '../models/ticket';

const router=express.Router();

router.put('/api/tickets/:id', 
    // (req: Request, res: Response, next)=>{
    //     console.log('HII');
    //     next()},
    requireAuth, async (req: Request, res: Response)=>{
    // console.log('HI');
    
    const ticket=await Ticket.findById(req.params.id);
    if(!ticket)
            throw new NotFoundError();

    if(ticket.userId !== req.currentUser?.id)
            throw new NotAuthorizedError()
    
    res.send(ticket);
})