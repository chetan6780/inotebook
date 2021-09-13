var jwt = require('jsonwebtoken');
const JWT_SECRET = 'chetanIsGood$boy';

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to the request object
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: 'No token, authorization denied' });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Token is not valid' });
    }
}

module.exports = fetchuser;