import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifytoken = (req, res, next) => {
  const token = req.cookies.token || req.headers['x-access-token'];
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!token) return res.status(401).json({msg: 'Unauthorized'});

  jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(403).json({error: err.message, msg: 'Forbidden'});
      req.user = decoded.user;
      next();
  })
} 