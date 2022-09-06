const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require('./user.controller');
const logger = require('../../middlewares/utils/logger');
const AdminUserModel = require('../../models/users/admin.user');
const AdminTokenModel = require('../../models/tokens/admin.token');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const config = require('../../middlewares/helpers/enums/config.enum');


const AdminUserController = {
	getAllAdmins(req, res) {
		UserController.getAllUsers(req, res, config.ADMIN);
	},
	
	getAdminById: (req, res) => {
		UserController.getUserById(req, res, config.ADMIN);
	},
	
	createAdmin: async (req, res) => {
		const {firstName, lastName, email, phone, password} = req.body;
		const encryptedUserPassword = await bcrypt.hash(password, config.BCRYPT_SALT_RATE);
		
		const user = await new AdminUserModel({
			_id: new mongoose.Types.ObjectId(),
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			phone: phone,
			password: encryptedUserPassword,
		});
		user.save().then(() => {
			const response = UserResponse.createUserResponse();
			jwt.sign(
				{userId: user.id}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}, async (error, result) => {
					if (error) {
						const response = AuthResponse.tokenExpired();
						logger.warn(response.message);
						return res.status(response.status).json({status: response.type, message: response.message});
					}
					const token = await new AdminTokenModel({token: result, userId: user.id});
					token.save().then(() => {
						logger.info(response.message);
						res.status(response.status).json({
							status: response.type, message: response.message,
							data: {
								id: user._id,
								firstName: user.firstName,
								lastName: user.lastName,
								email: user.email,
								phone: user.phone,
								updatedAt: user.updatedAt,
								createdAt: user.createdAt,
							}
						});
					});
				});
		}).catch((error) => {
			console.log(error);
			const response = UserResponse.getUserError();
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	updateAdmin(req, res) {
	},
	
	deleteAdmin(req, res) {
	}
	
}

module.exports = AdminUserController;

