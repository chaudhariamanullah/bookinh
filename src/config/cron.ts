import cron from "node-cron";
import bookingModel  from "../models/model.booking.js";

cron.schedule("*/10 * * * * *", async () => {
    try {
        await bookingModel.failedBookingStatus();
    } catch (err:any) {
        console.log(err.message);
    }
});