//SOURCE: https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
const AuthTokenModel = require('../../../models/tokens/auth.token.js');
const TokenService = require('../../services/auth.service');
const TokenResponse = require('../../helpers/responses/auth.response');


const TokenValidator = {

  validateAuth: (req, res, next) => {
    if (req.headers && req.headers['authorization']) {
      TokenService.verifyJWT(req, res, req.headers['authorization'], async data => {
        AuthTokenModel.findById(data.userId).then(user => {
          if (user.id === data.user_id) {
            res.locals.userData = user;
            res.locals.tokenOwner = data;
            next();
          } else {
            const response = TokenResponse.tokenNotFound();
            res.status(response.status).json({status: response.type, message: response.message});
          }
        }).catch(error => {
          const response = TokenResponse.tokenExpired();
          res.status(response.status).json({status: response.type, message: response.message});
        });
      });
    } else {
      const response = TokenResponse.tokenNotFound();
      res.status(response.status).json({status: response.type, message: response.message});
    }
  },

}

module.exports = TokenValidator;

