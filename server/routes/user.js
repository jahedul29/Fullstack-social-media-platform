import express from "express";
import { verifyLogin } from './../middlewares/auth.js';
import { addOrRemoveFriend, getFriendList, getUserDetails } from './../controllers/users.js';
import upload from './../utils/multerUploader.js';

const userRouter = express.Router();

userRouter.get("/:id", verifyLogin, upload.any(), getUserDetails);
userRouter.get("/:id/friends", verifyLogin, upload.any(), getFriendList);

userRouter.patch("/:id/:friendId", verifyLogin, upload.any(), addOrRemoveFriend);

export default userRouter;