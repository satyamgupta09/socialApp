const jwt = require('jsonwebtoken');
const secret_key = '12345';

const jwtAuthMiddleWare = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log('token=>', token);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        console.log(decoded);
        // console.log(decodes.userData.userId);
        req.userData = decoded; // Access userId from decoded.userData
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Invalid Token' });
    }
}

const GenerateToken = (userData) =>{
    return jwt.sign({userData}, secret_key, {expiresIn:80000});
}

module.exports = {jwtAuthMiddleWare, GenerateToken};