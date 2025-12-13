import express from 'express';
import cors from 'cors';

import bookRoute from './route/book.route.js';
import userRoute from './route/user.route.js'
import genreRoute from './route/genre.route.js';
import cartRoute from './route/cart.route.js';
import wishlistRoute from './route/wishlist.route.js';
import orderRoute from './route/order.route.js';
import siteSettingsRoute from './route/siteSettings.route.js';


const app = express()
app.use(cors());
app.use(express.json());


//defining routes
app.use('/api/books', bookRoute);
app.use('/api/users', userRoute);
app.use('/api/genres', genreRoute);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/orders', orderRoute);
app.use('/api/settings', siteSettingsRoute);


export default app;