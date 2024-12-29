import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import bookRoute from './route/book.route.js';
import userRoute from './route/user.route.js';
import connectDB from './utils/db.js';

//connect to mongoDB
connectDB();

const app = express();


app.use(cors({
  origin: 'https://book-store-app-fr.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

dotenv.config(
  {
    path:'./env'
  }
); 

const PORT = process.env.PORT || 4000;

//defining routes
app.use('/book', bookRoute);
app.use('/user', userRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})