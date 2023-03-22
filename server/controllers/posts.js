import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const { userId, title, description, location } = req.body;
        const user = User.findById(userId);
        const picturePath = `/assets/${req.file.filename}`;
    
        const newPost = new Post({
            userId,
            title,
            description,
            location,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        res.status(409).json({error: err.message})
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getSinglePost = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        res.status(200).json(post);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getUsersPost = async (req, res) => {
    try {
        const {userId} = req.params;

        const posts = await Post.find({userId});
        
        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const likeOrUnlikePost = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.userId.id;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({error: err.message});
        console.log({err})
    }
}