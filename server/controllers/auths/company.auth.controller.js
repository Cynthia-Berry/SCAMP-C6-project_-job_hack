const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CompanyUserModel = require('../../models/users/company.user');
const AuthTokenModel = require('../../models/tokens/auth.token.js');
const CompanyUserController = require('../users/company.user.controller');
const config = require('../../middlewares/helpers/enums/config.enum');
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const logger = require('../../middlewares/utils/logger');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");



const CompanyAuthController = {
	signIn(req, res) {
		const {email, password} = req.body;
		CompanyUserModel.findOne({email: email.toLowerCase()}).then(async company => {
			const encryptedUserPassword = await bcrypt.compare(password, user.password);
			
			//Check If User
			if (!company || !encryptedUserPassword) {//If user is not found or password don't exist
				const response = AuthResponse.logInError();
				logger.error(`[FAILED]: ${response.message}`);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {//if valid login credentials (user exist and password matches)
				
				//Find stored JWT For returning User
				AuthTokenModel.findOne({userId: company._id}).then(result => {
					jwt.verify(result.token, process.env.TOKEN_KEY, {userId: company._id}, async (err, data) => {
						
						//If JWT has expired sign/create a new one
						if (err || typeof err === 'undefined') {
							const userToken = jwt.sign(
								{userId: user._id}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}
							);
							await AuthTokenModel.updateOne({token: userToken}).where('userId').equals(user._id);
							company.token = userToken;
							
							//Else take the user in with existing JWT from the AuthTokenModel
						} else {
							const response = AuthResponse.LoginResponse();
							res.status(response.status).json({
								token: result.token, status: response.type, message: response.message
							});
						}
					});
				});
			}
		});
	},
	
	signUp: async (req, res) => {
		const isUserExist = await CompanyUserModel.findOne({email: req.body.email.toLowerCase()});
		if (isUserExist) {
			const response = UserResponse.getUserExistError();
			logger.error(`[FAILED]: ${response.message}`);
			return res.status(response.status).json({status: response.type, message: response.message});
		}
		await CompanyUserController.createAdmin(req, res);
	},
}

module.exports = AdminAuthController;
