import bookingModel from "../models/model.booking.js";
import type { AddBookingInput } from "../schemas/schema.addBooking.js";
import { v4 as uuidV4} from "uuid";

const bookingService = {

    async getSeatsByOrderId(orderId:string){
        return await bookingModel.fetchSeatsByOrderId(orderId)
    },
    async booking(booking:AddBookingInput){
        const booking_public_id = uuidV4();
        return await bookingModel.booking({booking_public_id,...booking});
    },

    async confirmBooking(order_id:string){
        return await bookingModel.confirmBookingStatus(order_id);
    },

    async cancelBooking(order_id:string){
        return await bookingModel.cancelBookingStatus(order_id);
    },

    async failedBooking(){
        return await bookingModel.failedBookingStatus();
    }
}

export default bookingService;