import { Router } from "express";
import bookingController from "../controllers/controller.booking.js";


const router = Router();

router.post("/fail",bookingController.failedBooking);
router.get("/seats/:orderId",bookingController.getSeatsByOrderId);
router.post("/",bookingController.booking);
router.post("/:orderId/confirm",bookingController.confirmBooking);
router.post("/:orderId/cancel",bookingController.cancelBooking);

export default router;