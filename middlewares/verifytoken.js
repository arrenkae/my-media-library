import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifytoken = (req, res, next) => {
    console.log(req.cookies);
    const accesstoken = req.headers['authorization'];
    const refreshtoken = req.cookies['refreshtoken'];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!accesstoken && !refreshtoken) return res.status(401).json({msg: 'Unauthorized'});

    try {
        const decoded = jwt.verify(accesstoken, secret);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log(error);
        if (!refreshtoken) {
            return res.status(401).json({ msg: 'Access Denied. No refresh token provided'});
        }
        try {
            const decoded = jwt.verify(refreshtoken, secret);
            const accesstoken = jwt.sign({ user: decoded.user }, secret, {
                expiresIn: '1h',
            });
            res
            .cookie('refreshtoken', refreshtoken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accesstoken)
            .status(200).json({ user: decoded.user });
        } catch (error) {
            return res.status(400).json({ msg: 'Invalid Token'});
        }
    }
}