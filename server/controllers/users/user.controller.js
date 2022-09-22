const AdminModel = require('../../models/users/admin.user');
const CompanyModel = require('../../models/company/company');
const ClientModel = require('../../models/users/client.user');
const TokenModel = require('../../models/tokens/auth.token');
const config = require("../../middlewares/helpers/enums/config.enum");
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const PaginationService = require('../../middlewares/services/pagination.service');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const logger = require("../../middlewares/utils/logger");
const UploadService = require('../../middlewares/services/upload.service');


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
				if (userType === config.COMPANY) {
					data.populate('company', async () => {
						data.company.profileImage = await UploadService.fetchFileSignedUrl(data.company.profileImage);
						const response = UserResponse.getUserResponse(userType, data);
						res.status(response.status).json({status: response.type, message: response.message, data: data});
					});
				} else if (userType === config.CLIENT) {
					data.populate('skills', async () => {
						data.profileImage = await UploadService.fetchFileSignedUrl(data.profileImage);
						for (const forEach of data.documents) forEach.url = await UploadService.fetchFileSignedUrl(forEach.url);
						const response = UserResponse.getUserResponse(userType, data);
						res.status(response.status).json({status: response.type, message: response.message, data: response.data});
					});
				} else {
					data.profileImage = await UploadService.fetchFileSignedUrl(data.profileImage);
					const response = UserResponse.getUserResponse(userType, data);
					res.status(response.status).json({status: response.type, message: response.message, data: response.data});
				}
			}
		});
	},
	
	updateUser: async (req, res, userType) => {
		const id = req.params.id;
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY) ? CompanyModel : ClientModel;
		if (userType === config.CLIENT) {
			const id = req.params.id;
			let newPortfolio = [], newSkills = [], newEducations = [],
				newDocument = [], newCategories = [], newApplications = [];
			if ("portfolio" in req.body) {
				newPortfolio = newPortfolio.concat(req.body.portfolio);
				delete req.body.portfolio;
				await UserController.updateUserPortfolio(id, newPortfolio);
			}
			if ("skills" in req.body) {
				newSkills = newSkills.concat(req.body.skills);
				delete req.body.skills;
				await UserController.updateUserSkills(id, newSkills);
			}
			if ("documents" in req.body) {
				newDocument = newDocument.concat(req.body.documents);
				delete req.body.documents;
				await UserController.updateUserDocuments(id, newDocument);
			}
			if ("educations" in req.body) {
				newEducations = newEducations.concat(req.body.educations);
				delete req.body.educations;
				await UserController.updateUserEducation(id, newEducations);
			}
			if ("categories" in req.body) {
				newCategories = newCategories.concat(req.body.categories);
				delete req.body.categories;
				await UserController.updateUserCategory(id, newCategories);
			}
			if ("applications" in req.body) {
				newApplications = newApplications.concat(req.body.applications);
				delete req.body.applications;
				await UserController.updateUserApplication(id, newApplications);
			}
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
	},
	
	updateUserPortfolio: (id, newPortfolio) => {
		ClientModel.findOneAndUpdate({_id: id}, {$set: {skills: newPortfolio}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = UserResponse.updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
	
	updateUserDocuments: (id, newDocuments) => {
		ClientModel.findOneAndUpdate({_id: id}, {$set: {documents: newDocuments}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = UserResponse.updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
	
	updateUserSkills: (id, newSkills) => {
		ClientModel.findOneAndUpdate({_id: id}, {$set: {skills: newSkills}}, {new: false, rawResult: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = UserResponse.updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
	
	updateUserEducation: (id, newEducation) => {
		ClientModel.findOneAndUpdate({_id: id}, {$set: {educations: newEducation}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = UserResponse.updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
	
	updateUserCategory: (id, newCategories) => {
		ClientModel.findOneAndUpdate({_id: id}, {$set: {categories: newCategories}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = UserResponse.updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
	
	updateUserApplication: (id, newApplications) => {
		ClientModel.findOneAndUpdate({_id: id}, {$set: {applications: newApplications}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = UserResponse.updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
}


module.exports = UserController;
