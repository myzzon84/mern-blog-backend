import { validationResult } from 'express-validator';

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(req.body);
        console.log('validationResult');
        return res.status(400).json(errors.array());
    }
    next();
};
