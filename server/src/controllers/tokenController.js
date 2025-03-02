const TokenService = require('../services/tokenService')
const logger = require('../logger/logger')

class TokenController {
  async refreshAccessToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      console.log("Refresh:", refreshToken)

      const newAccessToken = await TokenService.refreshAccessToken(refreshToken)

      res.setHeader('Authorization', `Bearer ${newAccessToken}`)
      res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
      logger.error(`Error refreshing the token - ${error.message}`)
      next(error)
    }
  }
}

module.exports = new TokenController()