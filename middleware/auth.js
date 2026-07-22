const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config');

const auth = async (req, res, next) => {
  try {
    // 1. Check for token in multiple locations (header, cookie, query)
    let token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.cookies?.token || 
                req.query?.token;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        code: 'NO_TOKEN_PROVIDED',
        message: 'Authentication required. Please provide a valid token.' 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, jwtSecret, { ignoreExpiration: false });

    // 3. Check token expiration separately for more detailed error
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return res.status(401).json({ 
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Session expired. Please login again.'
      });
    }

    // 4. Find user and check account status
    const user = await User.findOne({ 
      empId: decoded.empId 
    }).select('+lastLogin +passwordResetRequired');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'User account not found. Please sign up.'
      });
    }

    // 5. Check if password reset is required
    if (user.passwordResetRequired) {
      return res.status(403).json({
        success: false,
        code: 'PASSWORD_RESET_REQUIRED',
        message: 'Password reset required. Please update your password.'
      });
    }

    // 6. Update last login time (non-blocking)
    user.lastLogin = new Date();
    user.save().catch(err => console.error('Error updating last login:', err));

    // 7. Attach user to request
    req.user = {
      empId: user.empId,
      department: user.department,
      needsPasswordReset: user.passwordResetRequired
    };

    // 8. Set fresh token if nearing expiration (optional)
    const tokenAge = now - decoded.iat;
    if (tokenAge > 3600) { // If token is older than 1 hour
      const newToken = jwt.sign(
        { empId: user.empId, department: user.department },
        jwtSecret,
        { expiresIn: '8h' }
      );
      res.set('X-New-Token', newToken);
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    let status = 401;
    let code = 'AUTH_ERROR';
    let message = 'Authentication failed';

    if (error.name === 'TokenExpiredError') {
      code = 'TOKEN_EXPIRED';
      message = 'Session expired. Please login again.';
    } else if (error.name === 'JsonWebTokenError') {
      code = 'INVALID_TOKEN';
      message = 'Invalid token provided.';
    } else {
      status = 500;
      code = 'SERVER_ERROR';
      message = 'Authentication service unavailable.';
    }

    res.status(status).json({ 
      success: false,
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Higher privilege middleware (optional)
auth.admin = (req, res, next) => {
  auth(req, res, () => {
    // Add admin-specific checks here
    if (req.user.department !== 'HR' && req.user.department !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        code: 'INSUFFICIENT_PRIVILEGES',
        message: 'Admin privileges required'
      });
    }
    next();
  });
};

module.exports = auth;