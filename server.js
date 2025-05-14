import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url'

// Routes middleware
import authRoutes from './routes/auth.js'; 
import productRoutes from './routes/products.js'
import userRoutes from './routes/users.js'

// Load environment variables
// dotenv.config();
console.log('Loaded STORE_URL:', process.env.STORE_URL);

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'https://myafros.com',
        'https://elteema.com',
        'https://www.elteema.com'
    ]
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);


// Start the server
app.listen(PORT, () => {
    console.log('Server running on ', `http://localhost:${PORT}`);
});