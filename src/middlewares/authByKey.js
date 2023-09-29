export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    if (token === process.env.APP_SECRET) {
      next();
    } else {
      return res.status(401).json({ error: 'invalid Token' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'invalid Token' });
  }
};