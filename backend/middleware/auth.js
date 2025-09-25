// const jwt = require('jsonwebtoken');

// function authMiddleware(requiredRole) {
//   return (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token provided' });
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) return res.status(403).json({ message: 'Invalid token' });
//       if (requiredRole && user.role !== requiredRole) {
//         return res.status(403).json({ message: 'Forbidden: Insufficient role' });
//       }
//       req.user = user;
//       next();
//     });
//   };
// }

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // your User model

function authMiddleware(requiredRole) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from DB to ensure valid and get latest role
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });

      // Role-based access check
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }

      req.user = user; // attach full user to request
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Token is invalid or expired' });
    }
  };
}

module.exports = authMiddleware;
