const bcrypt = require("bcrypt");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const UserController = require('./user.controller');
const logger = require('../../middlewares/utils/logger');
const AdminUserModel = require('../../models/users/admin.user');
const AuthTokenModel = require('../../models/tokens/auth.token.js');
const config = require('../../middlewares/helpers/enums/config.enum');
const CharacterGenerator = require("../../middlewares/utils/char.generator");
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");

const AdminUserController = {
	getAllAdmins(req, res) {
		UserController.getAllUsers(req, res, config.ADMIN);
	},
	
	getAdminById: (req, res) => {
		UserController.getUserById(req, res, config.ADMIN);
	},
	
	createAdmin: async (req, res) => {
		const {firstName, lastName, email, phoneNumber, password} = req.body;
		const encryptedUserPassword = await bcrypt.hash(password, config.BCRYPT_SALT_RATE);
		
		const userObject = await new AdminUserModel({
			adminId: CharacterGenerator.userIdGenerator(firstName.replace(/\s+/g, '')),
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			phoneNumber: phoneNumber,
			password: encryptedUserPassword,
		});
		
		userObject.save().then(async () => {
			jwt.sign({
				userId: userObject.id,
				role: userObject.role
			}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}, async (error, result) => {
				if (error) {
					const response = AuthResponse.tokenExpired();
					return res.status(response.status).json({status: response.type, message: response.message});
				} else {
					const hours = moment().add(6, "hours");
					const update = {$set: {token: result, expireDate: hours, userId: userObject.id}};
					const options = {upsert: true, new: true, setDefaultsOnInsert: true};
					AuthTokenModel.findByIdAndUpdate(userObject.id, update, options, () => {
						const data = {
							id: userObject.id,
							adminId: userObject.adminId,
							firstName: userObject.firstName,
							lastName: userObject.lastName,
							email: userObject.email,
							phoneNumber: userObject.phoneNumber,
							updatedAt: userObject.updatedAt,
							createdAt: userObject.createdAt,
						}
						const response = UserResponse.createUserResponse(config.ADMIN, data);
						logger.info(response.message);
						res.status(response.status).json({
							status: response.type, message: response.message, data: response.data
						});
					})
				}
			});
		}).catch((error) => {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	updateAdmin: (req, res) => {
		UserController.updateUser(req, res, config.ADMIN);
	},
	
	deleteAdmin: (req, res) => {
		UserController.deleteUser(req, res, config.ADMIN);
	}
	
}

module.exports = AdminUserController;

