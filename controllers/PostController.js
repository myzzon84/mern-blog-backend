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
        const posts = await PostModel.find().populate('user').exec();
        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};
export const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const onePost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        );
        if (!onePost) {
            return res.status(404).json({
                message: 'Post not found',
            });
        }
        return res.json(onePost);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};
export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findByIdAndDelete(
            { _id: postId },
            { returnDocument: 'before' }
        );
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
            });
        }
        return res.json({
            message: 'Post successfully deleted',
            post,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting post',
        });
    }
};
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.updateOne(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            }
        );
        return res.json(post);
    } catch (error) {tags 
        console.log(error);
        return res.status(500).json({
            message: 'Error updating post',
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(20).exec();
        const tags = [];
        posts.forEach((posts) => {
            posts.tags.forEach((tag) => {
                if(tags.length < 5){
                    tags.push(tag);
                }
            });
        });
        return res.json(tags);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error when receiving tags',
        });
    }
};
