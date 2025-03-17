import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api.js'; // Ensure the file extension is included

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

// Routes
app.use('/', apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});