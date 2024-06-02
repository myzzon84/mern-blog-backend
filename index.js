import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import { createPost, getAllPost, getOnePost, removePost, updatePost } from './controllers/PostController.js';

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

app.use(express.json());

app.post('/auth/register', registerValidation, register);
app.post('/auth/login', loginValidation, login);
app.get('/auth/me', checkAuth, getMe);

app.get('/posts', getAllPost);
app.get('/posts/:id', getOnePost);
app.post('/posts', checkAuth, postCreateValidation, createPost);
app.delete('/posts', removePost);
app.patch('/posts', updatePost);

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log('Server OK!');
});
