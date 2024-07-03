import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const email = await UserModel.find({ email: req.body.email });
        if (email.length) {
            return res.status(400).json({
                message:
                    'Пользователь с таким адресом электронной почты уже существует',
            });
        }

        const name = await UserModel.find({ fullName: req.body.fullName });
        if (name.length) {
            return res.status(400).json({
                message: 'Такое имя уже занято',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.passwordHash, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Не удалось зарегистрироваться',
            error,
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const isValidPassword = await bcrypt.compare(
            req.body.passwordHash,
            user._doc.passwordHash
        );
        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Wrong login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Не удалось авторизоваться',
            error,
        });
    }
};

export const checkToken = async (req, res) => {
    if (req.body.token) {
        let decoded = {};
        try {
            decoded = jwt.verify(req.body.token, 'secret123');
        } catch (error) {
            return res.json({status: 400});
        }
        let user;
        if(decoded._id){
            user = await UserModel.findById(decoded._id);
        }
        
        if (user) {
            return res.json({status: 200});
        } else {
            return res.json({status: 400});
        }
    }else{
        return res.status(400).json({
            status: 400,
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { passwordHash, ...userData } = user._doc;

        return res.json({
            ...userData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getUserFullName = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.id);
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting user',
        });
    }
};
