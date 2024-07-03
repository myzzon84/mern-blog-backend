import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = req.headers.authorization || '';
    // const token = req.headers.authorization?.split(' ')[1] || '';
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next()
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: 'No acces! 14',
            });
        }
    } else {
        return res.status(403).json({
            message: 'No acces! 19',
        });
    }
};
