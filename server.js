import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
// Comment out routes that don't exist yet
// import userRoutes from './routes/userRoutes.js'
// import campaignRoutes from './routes/campaignRoutes.js'
// import bookmarkRoutes from './routes/bookmarkRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], // Allow multiple frontend ports
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/v1/auth", authRoutes);
// Comment out routes that don't exist yet
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/campaign", campaignRoutes);
// app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/community", communityRoutes);

app.get('/', (req,res)=>{
    res.send("<h1>Welcome to BlockFunder API</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});