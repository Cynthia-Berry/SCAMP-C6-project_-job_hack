const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../../middlewares/utils/logger');
const AdminUserModel = require('../../models/users/admin.user');
const AuthTokenModel = require('../../models/tokens/auth.token.js');
const AdminUserController = require('../users/admin.user.controller');
const config = require('../../middlewares/helpers/enums/config.enum');
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");


const AdminAuthController = {
	signIn(req, res) {
		try {
			const {adminId, password} = req.body;
			AdminUserModel.findOne({adminId: adminId}).then(async user => {
				console.log(user)
				const encryptedUserPassword = await bcrypt.compare(password, user.password);
				
				//Check If User
				if (!user || !encryptedUserPassword) {//If user is not found or password don't exist
					const response = AuthResponse.logInError();
					logger.error(`[FAILED]: ${response.message}`);
					res.status(response.status).json({status: response.type, message: response.message});
				} else {//if valid login credentials (user exist and password matches)
					
					//Find stored JWT For returning User
					AuthTokenModel.findOne({userId: user._id}).then(result => {
						jwt.verify(result.token, process.env.TOKEN_KEY, {userId: user._id}, async (err, data) => {
							
							//If JWT has expired sign/create a new one
							if (err || typeof err === 'undefined') {
								const userToken = jwt.sign(
									{userId: user._id}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}
								);
								await AuthTokenModel.updateOne({token: userToken}).where('userId').equals(user._id);
								user.token = userToken;
								
								//Else take the user in with existing JWT from the AdminTokenModel
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
		} catch (error) {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		}
	},
	
	signUp: async (req, res) => {
		const isUserExist = await AdminUserModel.findOne({email: req.body.email.toLowerCase()});
		if (isUserExist) {
			const response = UserResponse.getUserExistError();
			logger.error(`[FAILED]: ${response.message}`);
			return res.status(response.status).json({status: response.type, message: response.message});
		}
		await AdminUserController.createAdmin(req, res);
	},
}

module.exports = AdminAuthController;
