import express from "express";
import {login} from '../controllers/auth.js';
import upload from "../utils/multerUploader.js";

const authRouter = express.Router();

authRouter.post("/login", upload.any(), login);

export default authRouter;