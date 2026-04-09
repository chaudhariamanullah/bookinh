import pool from "../config/db.js";
import type { AddBooking } from "../types/type.addBooking.js";
import type { ResultSetHeader,RowDataPacket } from "mysql2/promise";

    const bookingModel = {

    async fetchSeatsByOrderId(orderId:string){

        const sql = `SELECT seat_public_id FROM booking
                    WHERE order_id = ?`;

        const [seats] = await pool.execute<RowDataPacket[]>(sql,[orderId]);
        return seats;
    },

    async booking(bookingData: AddBooking) {

        const bookedSeats = await bookingModel.checkSeats(bookingData.seat_public_id, bookingData.showtime_public_id);

        if (bookedSeats.length > 0) {
            return "Exists";
        }

        const sql = `INSERT INTO booking (
            booking_public_id,
            seat_public_id,
            seat_name,
            showtime_public_id,
            user_public_id,
            amount,
            order_id,
            booking_status,
            booking_expiry_at
        ) VALUES ?`;

        const values = bookingData.seat_public_id.map((seatPublicId, i) => [
            bookingData.booking_public_id,
            seatPublicId,
            bookingData.seat_names[i], // 🔥 add this
            bookingData.showtime_public_id,
            bookingData.user_public_id,
            bookingData.amount,
            bookingData.order_id,
            'pending',
            new Date(Date.now() + 5 * 60 * 1000)
        ]);

        const [result] = await pool.query<ResultSetHeader>(sql, [values]);

        if(result.affectedRows > 0)
            return true;
        
        return false;
    },

    async checkSeats(seatIds: string[], showtimeId: string) {

        if (seatIds.length === 0) return [];

        const placeholders = seatIds.map(() => '?').join(',');

        const sql = `
            SELECT seat_public_id FROM booking
            WHERE showtime_public_id = ?
            AND seat_public_id IN (${placeholders})
            AND booking_status IN ('pending','completed')
        `;

        const [rows] = await pool.query(sql, [showtimeId, ...seatIds]);

        return rows as { seat_public_id: string }[];
    },

    async confirmBookingStatus(order_id:string){
        const sql = `UPDATE booking
                    SET booking_status = 'completed',
                    booking_expiry_at = NULL
                    WHERE 
                    booking_status = 'pending'
                    AND booking_expiry_at >= NOW()
                    AND order_id = ?`;
                
        const [result] = await pool.execute<ResultSetHeader>(sql,[order_id]);
        
        if(result.affectedRows > 0)
            return true;
        
        return false;
    },

    async cancelBookingStatus(order_id:string){
        const sql = `UPDATE booking
                    SET booking_status = 'cancelled',
                    booking_expiry_at = NULL
                    WHERE
                    order_id = ?
                    AND booking_status = 'pending'`;

        const [result] = await pool.execute<ResultSetHeader>(sql,[order_id]);
        
        if(result.affectedRows > 0)
            return true;
        
        return false;
    },

    async failedBookingStatus(){
        const sql = `UPDATE booking
                    SET booking_status = 'failed',
                    booking_expiry_at = NULL
                    WHERE 
                    booking_expiry_at < NOW()
                    AND booking_status = 'pending'`;

        await pool.execute<ResultSetHeader>(sql);
        return;   
    }

}

export default bookingModel;