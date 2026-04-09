export interface AddBooking {
    booking_public_id:string;
    seat_public_id:string[];
    seat_names:string[];
    showtime_public_id:string;
    user_public_id:string;
    amount:number;
    order_id:string
}