import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';
import bcrypt from 'bcrypt';

mongoose
    .connect(
        'mongodb+srv://myzzon84:watnjCGG8WuMoRcY@cluster0.pjbliz4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => {
        console.log('DB ok!');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const email = await UserModel.find({ email: req.body.email });
    if (email.length) {
        return res.status(400).json({
            message:
                'Пользователь с таким адресом электронной почты уже существует',
        });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.passwordHash, salt);

    const doc = new UserModel({
        email: req.body.email,
        passwordHash,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    return res.json(user);
});

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log('Server OK!');
});
