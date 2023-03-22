import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from "./controllers/auth.js";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import upload from './utils/multerUploader.js';

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

//ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register)

//ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes)

//  MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(()=> {
    app.listen(PORT, ()=> console.log(`Server connected at Port: ${PORT}`));
}).catch((err)=> {
    console.error("error", process.env.MONGO_URL, err)
    console.log("Database did not connected")
})