import PostModel from '../models/Post.js';

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user',).exec();
        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};
export const getOnePost = async (req, res) => {
    
};
export const removePost = async (req, res) => {};
export const updatePost = async (req, res) => {};
