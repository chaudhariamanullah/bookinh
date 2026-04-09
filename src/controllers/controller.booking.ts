import type { Request, Response } from "express";
import { AddBookingSchema } from "../schemas/schema.addBooking.js";
import bookingService from "../services/service.booking.js";

const bookingController = {

    async getSeatsByOrderId(req:Request,res:Response){

        const orderId = req.params.orderId as string;

        if(!orderId)
            return res.status(400).json({message:"No Order Id"});

        const seats = await bookingService.getSeatsByOrderId(orderId);
        return res.status(200).json(seats);
    },

    async booking(req:Request,res:Response){
        try{
            const booking = AddBookingSchema.parse(req.body);
            const booked = await bookingService.booking(booking);

            if(booked === "Exists")
                return res.status(409).json({message:"Selected Seats Cannot Be Booked"})

            if(booked)
                return res.status(201).json({message:"Booking Intiated"});
            else
                return res.status(409).json({message:"Booking Insertion With Pending Status Failed"});

        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async confirmBooking(req:Request,res:Response){
        try{
            const order_id = req.params.orderId as string;
            const confirm = await bookingService.confirmBooking(order_id);

            if(confirm)
                return res.status(200).json({message:"Booking Completed"});
            else
                return res.status(409).json({message:"No Booking Found For Confirmation"});
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async cancelBooking(req:Request,res:Response){
        try{
            const order_id = req.params.orderId as string;
            const cancel = await bookingService.cancelBooking(order_id);

            if(cancel)
                return res.status(200).json({message:"Booking Cancelled"});
            else
                return res.status(409).json({message:"No Booking Found For Cancellation"});

        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async failedBooking(req:Request,res:Response){
        try{
             await bookingService.failedBooking();
             return res.status(200).json({message:"Failed Booking Cron Done"})
        }catch(err){
            return res.status(500).json({error:err});
        }
    }
}

export default bookingController;