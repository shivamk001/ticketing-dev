import express, { Request, Response } from "express";
import { requireAuth, validationRequest, BadRequestError, NotFoundError  } from "@shivamkesarwani001/ticketing_common";
import { Order } from "../models/order";
import { body } from "express-validator";

const router=express.Router();

router.post('/api/payments', 
        requireAuth,
        [
            body('token')
                .not()
                .isEmpty(),
            body('orderId')
                .not()
                .isEmpty()
        ],
        validationRequest,
        async (req: Request, res: Response)=>{
            res.send({success: true});
        }
);

export { router as createChargeRouter };