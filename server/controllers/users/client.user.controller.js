const bcrypt = require("bcrypt");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const UserController = require('./user.controller');
const logger = require('../../middlewares/utils/logger');
const ClientUserModel = require('../../models/users/client.user');
const AuthTokenModel = require('../../models/tokens/auth.token.js');
const config = require('../../middlewares/helpers/enums/config.enum');
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const ClientModel = require("../../models/users/client.user");

const ClientUserController = {
	getAllClients(req, res) {
		UserController.getAllUsers(req, res, config.CLIENT);
	},
	
	getClientById: (req, res) => {
		UserController.getUserById(req, res, config.CLIENT);
	},
	
	createClient: async (req, res) => {
		const {firstName, lastName, email, phoneNumber, password} = req.body;
		const encryptedUserPassword = await bcrypt.hash(password, config.BCRYPT_SALT_RATE);
		
		const clientObject = await new ClientUserModel({
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			phoneNumber: phoneNumber,
			password: encryptedUserPassword,
		});
		
		clientObject.save().then(async () => {
			jwt.sign({
				userId: clientObject.id,
				role: clientObject.role
			}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}, async (error, result) => {
				if (error) {
					const response = AuthResponse.tokenExpired();
					return res.status(response.status).json({status: response.type, message: response.message});
				} else {
					const hours = moment().add(6, "hours");
					const update = {$set: {token: result, expireDate: hours, userId: clientObject.id}};
					const options = {upsert: true, new: true, setDefaultsOnInsert: true};
					AuthTokenModel.findByIdAndUpdate(clientObject.id, update, options, () => {
						const data = {
							id: clientObject.id,
							firstName: clientObject.firstName,
							lastName: clientObject.lastName,
							email: clientObject.email,
							phoneNumber: clientObject.phoneNumber,
							updatedAt: clientObject.updatedAt,
							createdAt: clientObject.createdAt,
						}
						const response = UserResponse.createUserResponse(config.CLIENT, data);
						logger.info(response.message);
						res.status(response.status).json({status: response.type, message: response.message, data: response.data});
					})
				}
			});
		}).catch((error) => {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	updateClient(req, res) {
		UserController.updateUser(req, res, config.CLIENT)
	},
	
	deleteClient: (req, res) => {
		UserController.deleteUser(req, res, config.CLIENT);
	},
}

module.exports = ClientUserController;

