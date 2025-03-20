import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api.js'; // Ensure the file extension is included
import path from 'path'
import { fileURLToPath } from 'url'

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config();

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
        'https://elteema.vercel.app'
    ]
};
app.use(cors(corsOptions));

// Routes
app.use('/', apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});