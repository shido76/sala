import CustomError from "../lib/customError.js";
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (req.url.includes('/session')) {
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'JWT Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
    
  } catch (err) {
    const error = new CustomError(err, 401);
    return next(error);
  }
};