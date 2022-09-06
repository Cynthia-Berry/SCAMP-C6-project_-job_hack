const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../../middlewares/utils/logger');
const AdminUserModel = require('../../models/users/admin.user');
const AdminTokenModel = require('../../models/tokens/admin.token');
const AdminUserController = require('../users/admin.user.controller');
const config = require('../../middlewares/helpers/enums/config.enum');
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');


const AdminAuthController = {
	signIn(req, res) {
		const {email, password} = req.body;
		AdminUserModel.findOne({email: email.toLowerCase()}).then(async user => {
			const encryptedUserPassword = await bcrypt.compare(password, user.password);
			
			//Check If User
			if (!user || !encryptedUserPassword) {//If user is not found or password don't exist
				const response = AuthResponse.logInError();
				logger.error(`[FAILED]: ${response.message}`);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {//if valid login credentials (user exist and password matches)
				
				//Find stored JWT For returning User
				AdminTokenModel.findOne({userId: user.id}).then(result => {
					jwt.verify(result.token, process.env.TOKEN_KEY, {userId: user.id}, async (err, data) => {
						
						//If JWT has expired sign/create a new one
						if (err || typeof err === 'undefined') {
							const userToken = jwt.sign(
								{userId: user.id}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}
							);
							await AdminTokenModel.updateOne({token: userToken}).where('userId').equals(user.id);
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
