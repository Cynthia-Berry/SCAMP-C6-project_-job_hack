const AdminModel = require('../../models/users/admin.user');
const CompanyModel = require('../../models/company/company');
const ClientModel = require('../../models/users/client.user');
const TokenModel = require('../../models/tokens/auth.token');
const config = require("../../middlewares/helpers/enums/config.enum");
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const PaginationService = require('../../middlewares/services/pagination.service');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const ResourceController = require("../resources/resource.controller")
const logger = require("../../middlewares/utils/logger");

let UserModel;

const UserController = {
	
	getAllUsers: (req, res, userType) => {
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY) ? CompanyModel : ClientModel;
		const paginate = PaginationService.validatePageNo(req);
		const filterQuery = PaginationService.filterPaginateQuery(req);
		UserModel.countDocuments(filterQuery, (err, totalCount) => {
			if (err || totalCount < 0) {
				const response = UserResponse.getUserError(err, userType);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const exceptions = "-applications -documents -password -categories -portfolio -skills";
				UserModel.find(filterQuery, exceptions, paginate.query, (err, users) => {
					if (err) {
						const response = databaseError(err);
						logger.error(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = UserResponse.getUserResponse(userType, users);
						logger.info(response.message)
						res.status(response.status).json({
							status: response.type, message: response.message, count: totalCount, pageNo: paginate.pageNo,
							pages: pages, data: response.data
						});
					}
				})
			}
		});
	},
	
	getUserById: (req, res, userType) => {
		const id = req.params.id;
		UserModel = (userType === config.ADMIN) ? AdminModel : userType === config.COMPANY ? CompanyModel : ClientModel;
		UserModel.findById(id, "-password", async (err, data) => {
			if (err) {
				const response = UserResponse.getUserError(err, userType);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = UserResponse.getUserResponse(userType, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	updateUser: async (req, res, userType) => {
		const id = req.params.id;
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY) ? CompanyModel : ClientModel;
		if (userType === config.CLIENT && ("portfolio" || "documents" || "skills" || "categories" || "applications") in req.body) {
			await ResourceController.updateUserResources(req, res)
		}
		UserModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, data) => {
			if (err) {
				const response = UserResponse.getUserError(err, userType);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = UserResponse.updateUserSuccess(data, userType);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteUser: (req, res, userType) => {
		const id = req.params.id;
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY || userType === config.COMPANY_ADMIN) ? CompanyModel : ClientModel;
		UserModel.findByIdAndDelete(id, async (err) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				TokenModel.findOneAndDelete({userId: id}, async (err) => {
					if (err) {
						const response = databaseError(err);
						logger.error(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const response = UserResponse.deleteUserSuccess(userType);
						logger.info(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					}
				});
			}
		});
	}
}


module.exports = UserController;
