import express from 'express';
import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from './validations.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import {
    createPost,
    getAllPost,
    getOnePost,
    removePost,
    updatePost,
} from './controllers/PostController.js';
import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';

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

app.post('/auth/register', registerValidation, handleValidationErrors, register);
app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    return res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', getAllPost);
app.get('/posts/:id', getOnePost);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, createPost);
app.delete('/posts/:id', checkAuth, removePost);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, updatePost);

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log('Server OK!');
});
