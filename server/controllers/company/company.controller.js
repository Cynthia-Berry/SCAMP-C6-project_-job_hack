const bcrypt = require("bcrypt");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const UserController = require('../users/user.controller');
const logger = require('../../middlewares/utils/logger');
const CompanyModel = require('../../models/company/company');
const AuthTokenModel = require('../../models/tokens/auth.token.js');
const config = require('../../middlewares/helpers/enums/config.enum');
const CharacterGenerator = require("../../middlewares/utils/char.generator");
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");

const CompanyController = {
	getAllCompany(req, res) {
		UserController.getAllUsers(req, res, config.COMPANY);
	},
	
	getCompanyById: (req, res) => {
		UserController.getUserById(req, res, config.COMPANY);
	},
	
	createCompany: async (req, res) => {
		const {name, firstName, lastName, email, phoneNumber, website, password} = req.body;
		const encryptedUserPassword = await bcrypt.hash(password, config.BCRYPT_SALT_RATE);
		const companyObject = await new CompanyModel({
			companyId: CharacterGenerator.userIdGenerator(name.replace(/\s+/g, '')),
			name: name,
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			website: website,
			phoneNumber: phoneNumber,
			password: encryptedUserPassword,
		});
		
		companyObject.save().then(async () => {
			jwt.sign({
				userId: companyObject.id,
				role: companyObject.role
			}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}, async (error, result) => {
				if (error) {
					const response = AuthResponse.tokenExpired();
					return res.status(response.status).json({status: response.type, message: response.message});
				} else {
					const hours = moment().add(6, "hours");
					const update = {$set: {token: result, expireDate: hours, userId: companyObject.id}};
					const options = {upsert: true, new: true, setDefaultsOnInsert: true};
					
					AuthTokenModel.findByIdAndUpdate(companyObject.id, update, options, () => {
						const data = {
							id: companyObject.id,
							companyId: companyObject.companyId,
							name: companyObject.name,
							firstName: companyObject.firstName,
							lastName: companyObject.lastName,
							email: companyObject.email,
							website: companyObject.website,
							phoneNumber: companyObject.phoneNumber,
							updatedAt: companyObject.updatedAt,
							createdAt: companyObject.createdAt,
						}
						const response = UserResponse.createUserResponse(config.COMPANY, data);
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
	
	
	updateCompany(req, res) {
		UserController.updateUser(req, res, config.COMPANY)
	},
	
	deleteCompany: (req, res) => {
		UserController.deleteUser(req, res, config.COMPANY);
	}
	
}

module.exports = CompanyController;

