//SOURCE: https://www.freecodecamp.org/news/how-to-authenticate-users-and-implement-cors-in-nodejs-applications/
const jwt = require("jsonwebtoken");
const tokenEnums = require('../helpers/enums/token.enum');
const AuthResponse = require('../helpers/responses/auth.response');

const TokenService = {
	bearerSplit: token => token.split(' ')[1],
	
	verifyJWT: (req, res, bearerToken, cb) => {
		const token = TokenService.bearerSplit(bearerToken);
		
		jwt.verify(token, process.env.TOKEN_KEY, {}, async (error, data) => {
			if (error) {
				if (error.name === tokenEnums.TOKEN_EXPIRED) {
					const response = AuthResponse.tokenExpired();
					res.status(response.status).json({status: response.type, message: response.message});
				} else if (error.name === tokenEnums.JWT_TOKEN_ERROR) {
					const response = AuthResponse.invalidTokenError();
					res.status(response.status).json({status: response.type, message: response.message});
				} else {
					const response = AuthResponse.tokenNotFound();
					res.status(response.status).json({status: response.type, message: response.message});
				}
			} else cb(data);
		})
	}
}
module.exports = TokenService;
