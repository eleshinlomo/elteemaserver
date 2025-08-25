import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url'

// Routes middleware
import authRoutes from './routes/auth.js'; 
import userRoutes from './routes/users.js'
import messageRoutes from './routes/message.js'
import feedRoutes from './routes/feedsRoute.js'
import storeRoute from './routes/storeRoute.js'
import paymentRoutes from './routes/payments.js'
import productRoutes from './routes/product.js'
import adminRoutes from './routes/admin.js'
import prototypeRoutes from './routes/waitlist.js'
import stripeRoutes from './routes/stripeRoutes.js'
import mongoose from 'mongoose'
import fetch from 'node-fetch'
// Load environment variables
// dotenv.config();
console.log('Loaded STORE_URL:', process.env.STORE_URL);

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


const app = express();
const PORT = process.env.PORT || 3005;
const MONGO_URL = process.env.MONGO_URL


mongoose.connect(MONGO_URL)
  .then(() => console.log('Server connected to the database'))
  .catch((err) => console.error('Database connection error:', err));




// Middleware
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'https://myafros.com',
        'https://elteema.com',
        'https://www.elteema.com',
        'https://elteema.online',
        'https://www.elteema.online',
        'https://rentalora.com',
        'https://www.rentalora.com'
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'userId'],
};
app.use(cors(corsOptions));
app.set('trust proxy', true);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/store', storeRoute);
app.use('/api/payments', paymentRoutes);
app.use('/api/product', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prototype', prototypeRoutes);



// Start the server
app.listen(PORT, () => {
    console.log('Server running on ', `http://localhost:${PORT}`);
});