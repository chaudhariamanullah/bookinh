import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bookingRouter from "../src/routers/route.booking.js";
import "./config/cron.js";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json());
app.use("/booking",bookingRouter);

export default app;