const ApplicationModel = require("../../models/vacancy/application");
const logger = require("../../middlewares/utils/logger");
const config = require("../../middlewares/helpers/enums/config.enum");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const VacancyResponse = require("../../middlewares/helpers/responses/vacancy.response");
const PaginationService = require("../../middlewares/services/pagination.service");

const ApplicationController = {
	creatApplication: async (req, res) => {
		const applicationObject = await new ApplicationModel(req.body);
		
		applicationObject.save().then(() => {
			const response = VacancyResponse.createVacancy(config.APPLICATION, applicationObject)
			logger.info(response.message);
			res.status(response.status).json({status: response.type, message: response.message, data: response.data});
		}).catch(error => {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	getAllApplication: (req, res) => {
		const paginate = PaginationService.validatePageNo(req);
		const filterQuery = PaginationService.filterPaginateQuery(req);
		
		ApplicationModel.countDocuments(filterQuery, (err, totalCount) => {
			if (err || totalCount < 0) {
				const response = VacancyResponse.getVacancyError(config.APPLICATION, err,);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				ApplicationModel.find(filterQuery, '', paginate.query, (err, data) => {
					if (err) {
						const response = databaseError(err);
						logger.error(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = VacancyResponse.getVacancyResponse(config.APPLICATION, data);
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
	
	getApplication: (req, res) => {
		ApplicationModel.findById(req.params.id, "", async (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.APPLICATION, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.getVacancyResponse(config.APPLICATION, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	getApplicationByCompany: (req, res) => {
		console.log(res.locals)
		ApplicationModel.findOne({company: res.locals.tokenOwner['userData']}, "", async (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.APPLICATION, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.getVacancyResponse(config.APPLICATION, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	getApplicantsApplication: (req, res) => {
		console.log(res.locals.tokenOwner['userData'])
		ApplicationModel.findOne({user: res.locals.tokenOwner['userData']}, "", async (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.APPLICATION, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.getVacancyResponse(config.APPLICATION, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	updateApplication: (req, res) => {
		ApplicationModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.APPLICATION, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.updateVacancy(config.APPLICATION, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteApplication: (req, res) => {
		ApplicationModel.findByIdAndDelete(req.params.id, async (err) => {
			if (err) {
				const response = databaseError(err);
				logger.warn(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.deleteVacancy(config.APPLICATION)
				logger.info(response.message);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
}
module.exports = ApplicationController;

