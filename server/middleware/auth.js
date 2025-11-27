const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = auth.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
