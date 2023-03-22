import express from 'express';
import { createPost, getAllPosts, getSinglePost, getUsersPost, likeOrUnlikePost } from '../controllers/posts.js';
import upload from '../utils/multerUploader.js';
import { verifyLogin } from './../middlewares/auth.js';

const postRouter = express.Router();

postRouter.get("/", verifyLogin, getAllPosts);
postRouter.get("/:id", verifyLogin, getSinglePost);
postRouter.get("/user/:userId", verifyLogin, getUsersPost);

postRouter.post("/", verifyLogin, upload.single('picture'), createPost);

postRouter.patch("/likeorunlike/:id", verifyLogin, likeOrUnlikePost);

export default postRouter;