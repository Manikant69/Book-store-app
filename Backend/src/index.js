import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';
import { PORT } from './constants.js';

dotenv.config({
  path:"./.env"
});

const SERVER_PORT = process.env.PORT || PORT;


connectDB().then(()=>{
  app.listen(SERVER_PORT, () => {
    console.log(`Server is listening on port ${SERVER_PORT}`)
  })
})
.catch((error)=>{
  console.log("Mongo DB connection failed!!", error);
})

