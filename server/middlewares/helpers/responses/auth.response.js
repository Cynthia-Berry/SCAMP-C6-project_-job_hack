const errorCodes = require("../enums/errorCodes.enum");
const successCodes = require("../enums/successCodes.enum");
const tokenResponse = require("../enums/token.enum");


const AuthResponse = {
	logInError() {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: 'Invalid login Credentials'
		}
	},
	
	LoginResponse() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `Login Successful`
		};
	},
	
	invalidTokenError() {
		return {
			status: errorCodes.Error401.code, type: errorCodes.Error401.type,
			message: tokenResponse.INVALID_TOKEN
		};
	},
	
	tokenExpired() {
		return {
			status: errorCodes.Error401.code, type: tokenResponse.EXPIRED,
			message: 'Token expired, Login!'
		};
	},
	
	tokenNotFound() {
		return {
			status: errorCodes.Error401.code, type: tokenResponse.TOKEN_NOT_FOUND,
			message: 'You do not have permissions to process this action'
		};
	},
	unauthorized() {
		return {
			status: errorCodes.Error401.code, type: tokenResponse.TOKEN_NOT_FOUND,
			message: 'You do not have permissions to process this action'
		};
	},
}

module.exports = AuthResponse;
