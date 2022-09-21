const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const logger = require('../../middlewares/utils/logger');
const CompanyModel = require('../../models/company/company');
const CompanyController = require('../company/company.controller');
const AuthTokenModel = require('../../models/tokens/auth.token.js');
const config = require('../../middlewares/helpers/enums/config.enum');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const AuthResponse = require('../../middlewares/helpers/responses/auth.response');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");


const CompanyAuthController = {
	signIn(req, res) {
		try {
			const {companyId, password} = req.body;
			
			CompanyModel.findOne({companyId: companyId}, async (error, dataExists) => {
				if (error || !dataExists) {//If user is not found or password don't exist
					const response = UserResponse.userNotFoundError(config.COMPANY);
					logger.error(response.message);
					res.status(response.status).json({status: response.type, message: response.message});
				} else {
					bcrypt.compare(password, dataExists.password, async (err, response) => {
						if (err || !response) {
							const response = AuthResponse.logInError();
							logger.error(`[FAILED]: ${response.message}`);
							res.status(response.status).json({status: response.type, message: response.message});
						} else {
							jwt.verify(response.token, process.env.TOKEN_KEY, {userId: dataExists.id}, async (err, data) => {
								if (err || typeof err === 'undefined') {
									jwt.sign({userId: dataExists.id, role: dataExists.role, companyId: dataExists.companyId}, process.env.TOKEN_KEY, {expiresIn: config.JWT_EXPIRE_PERIOD}, async (error, token) => {
										const hours = moment().add(6, "hours");
										const update = {$set: {token: token, expireDate: hours, userId: dataExists.id}};
										const options = {upsert: true, new: true, setDefaultsOnInsert: true};
										AuthTokenModel.findByIdAndUpdate(dataExists.id, update, options, () => {
											const response = AuthResponse.LoginResponse();
											logger.info(response.message);
											res.status(response.status).json({
												token: token, status: response.type, message: response.message
											})
										})
									})
								} else {
									const response = AuthResponse.LoginResponse();
									logger.info(response.message);
									res.status(response.status).json({
										token: data, status: response.type, message: response.message
									});
								}
							});
						}
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
		const isUserExist = await CompanyModel.findOne({email: req.body.email.toLowerCase()});
		if (isUserExist) {
			const response = UserResponse.getUserExistError(config.COMPANY);
			logger.error(`[FAILED]: ${response.message}`);
			return res.status(response.status).json({status: response.type, message: response.message});
		}
		await CompanyController.createCompany(req, res);
	},
}

module.exports = CompanyAuthController;
