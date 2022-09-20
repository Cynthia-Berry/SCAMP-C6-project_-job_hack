const AdminModel = require('../../models/users/admin.user');
const CompanyModel = require('../../models/company/company');
const ClientModel = require('../../models/users/client.user');
const config = require("../../middlewares/helpers/enums/config.enum");
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const PaginationService = require('../../middlewares/services/pagination.service');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");

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
				// const exceptions = "-applications -documents -password -categories -portfolio -skills";
				UserModel.find(filterQuery, '-password', paginate.query, (err, users) => {
					if (err) {
						const response = databaseError(err);
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = UserResponse.getUserResponse(userType, users);
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
		UserModel.findById(id, "-password -documents", async (err, data) => {
			if (err) {
				const response = UserResponse.getUserError(err, userType);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = UserResponse.getUserResponse(userType, data);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	updateUser: async (req, res, userType) => {
		let newPortfolio = [];
		const id = req.params.id;
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY) ? CompanyModel : ClientModel;
		if ("portfolio" in req.body) {
			newPortfolio = newPortfolio.concat(req.body.portfolio);
			delete req.body.portfolio;
			await UserController.updateUserPortfolio(id, newPortfolio);
		}
		console.log(UserModel)
		UserModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, data) => {
			if (err) {
				const response = databaseError(err);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = UserResponse.updateUserSuccess(data, userType);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	updateUserPortfolio: () => {
		ClientModel.findOneAndUpdate({_id: id}, {$push: {portfolio: newPortfolio}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
	
	deleteUser: (req, res, userType) => {
		const id = req.params.id;
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY || userType === config.COMPANY_ADMIN) ? CompanyModel : ClientModel;
		UserModel.findByIdAndDelete(id, async (err) => {
			if (err) {
				const response = databaseError(err);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = UserResponse.deleteUserSuccess(userType);
				res.status(response.status).json({status: response.type, message: response.message});
			}
		})
	}
}


module.exports = UserController;
