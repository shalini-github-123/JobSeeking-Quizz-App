const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = (roles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      console.log("Decoded Token:", decodedToken);

      const { _id, role } = decodedToken;
      console.log("Decoded Token ID and Role:", _id, role);

      req.user = await User.findById(_id).select('_id email role');

      if (!req.user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.log("JWT Verification Error:", error);
      res.status(401).json({ error: 'Request is not authorized' });
    }
  };
};

module.exports = requireAuth;
