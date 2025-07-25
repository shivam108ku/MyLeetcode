const rateLimit = require('express-rate-limit');

const submissionRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP/user to 5 requests per windowMs
  message: "Too many submissions from this IP, please try again after a minute",
});

module.exports = submissionRateLimiter;
