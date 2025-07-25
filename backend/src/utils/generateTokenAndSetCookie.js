// utils/generateTokenAndSetCookie.js
const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  // decide cookie attributes by environment
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly : true,
    secure   : isProd,                // must be true when SameSite=None
    sameSite : isProd ? 'None' : 'Lax',  // cross-site in prod, lax on localhost
    maxAge   : 7 * 24 * 60 * 60 * 1000,
    path     : '/'                    // send to every route
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
