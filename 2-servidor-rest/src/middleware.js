require('dotenv').config();
const jwt = require('jsonwebtoken');

function authJWTTokenMiddleware(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(403).json({ message: 'No token provided' });
        }
    } else {
        return res.status(403).json({ message: 'No token provided' });
    }
}

module.exports = authJWTTokenMiddleware;