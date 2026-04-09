import amqp from "amqplib";
import type { Booking } from "../types/type.bookingSuccess.js";

export async function publisherBookingFailed(payload:Booking){
    
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();

    const exchange = "booking.events";
    const routingKey = "booking.failed";

    await channel.assertExchange(exchange, "topic", {durable:true});

    channel.publish(
        exchange,
        routingKey,
        Buffer.from( JSON.stringify(payload) ),
        { persistent: true }
    );
}