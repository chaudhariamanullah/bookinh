import { z } from "zod";

export const AddBookingSchema = z.object({
    seat_public_id:z.array(z.string()).min(1).max(10),
    seat_names:z.array(z.string()).min(1).max(10),
    showtime_public_id:z.string(),
    user_public_id:z.string(),
    order_id:z.string(),
    amount:z.number()
}).strict();


export type AddBookingInput = z.infer< typeof AddBookingSchema >;