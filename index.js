import express from 'express';
import mongoose from 'mongoose';
import * as validations from './validations.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import multer from 'multer';
import * as utils from './utils/index.js';
import cors from 'cors';

mongoose
    .connect(
        'mongodb+srv://myzzon84:watnjCGG8WuMoRcY@cluster0.pjbliz4.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => {
        console.log('MongoDB OK!');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.post(
    '/auth/register',
    validations.registerValidation,
    utils.handleValidationErrors,
    UserController.register
);
app.post(
    '/auth/login',
    validations.loginValidation,
    utils.handleValidationErrors,
    UserController.login
);
app.get('/auth/me', utils.checkAuth, UserController.getMe);

app.post('/upload', utils.checkAuth, upload.single('image'), (req, res) => {
    return res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAllPost);
app.get('/posts/one/:id', PostController.getOnePost);
app.get('/posts/tags', PostController.getLastTags);
app.post(
    '/posts',
    utils.checkAuth,
    validations.postCreateValidation,
    utils.handleValidationErrors,
    PostController.createPost
);
app.delete('/posts/one/:id', utils.checkAuth, PostController.removePost);
app.patch(
    '/posts/one/:id',
    utils.checkAuth,
    validations.postCreateValidation,
    utils.handleValidationErrors,
    PostController.updatePost
);

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log('Server OK!');
});
