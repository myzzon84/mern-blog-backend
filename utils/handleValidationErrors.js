import { validationResult } from 'express-validator';

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        console.log('validationResult');
        return res.status(400).json(errors.array());
    }
    next();
};
