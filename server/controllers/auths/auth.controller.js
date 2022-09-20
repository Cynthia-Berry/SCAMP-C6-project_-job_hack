const TokenModel = require('../../models/tokens/auth.token');
const TokenService = require("../../middlewares/services/auth.service");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const AuthResponse = require("../../middlewares/helpers/responses/auth.response");

const AuthController = {
  logout: (req, res) => {
    const id = TokenService.getValue(req, 'id');
    TokenModel.deleteMany({userId: id}, async (err) => {
      if (err) {
        const response = databaseError(err);
        res.status(response.status).json({status: response.type, message: response.message});
      } else {
        const response = AuthResponse.userSuccessfullyLoggedOut();
        res.status(response.status).json({status: response.type, message: response.message});
      }
    })
  },
}

module.exports = AuthController;
