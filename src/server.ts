import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = 3006;

app.listen(PORT,()=>{
    console.log(`${PORT} Is Running`);
});