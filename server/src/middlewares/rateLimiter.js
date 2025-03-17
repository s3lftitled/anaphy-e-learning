const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 8, 
  handler: (req, res, next) => {
    res.status(429).json({ error: "Too many requests from this IP, please try again after 5 mins" })
  }
})

module.exports = limiter