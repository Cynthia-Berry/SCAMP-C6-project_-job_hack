const VacancyModel = require("../../models/vacancy/vacancy");
const CountController = require("../../controllers/vacancy/counts.controller");
const logger = require("../../middlewares/utils/logger");
const config = require("../../middlewares/helpers/enums/config.enum");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const VacancyResponse = require("../../middlewares/helpers/responses/vacancy.response");
const PaginationService = require("../../middlewares/services/pagination.service");


const VacancyController = {
	creatVacancy: async (req, res) => {
		const {title, position, description, location, workType} = req.body
		const vacancyObject = await new VacancyModel({
			company: res.locals.tokenOwner.userId,
			title: title,
			position: position,
			description: description,
			location: location,
			workType: workType
		});
		vacancyObject.save().then(async () => {
			await CountController.creatCount(req, res, vacancyObject)
		}).catch(error => {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	getAllVacancy: (req, res) => {
		const paginate = PaginationService.validatePageNo(req);
		const filterQuery = PaginationService.filterPaginateQuery(req);
		
		VacancyModel.countDocuments(filterQuery, (err, totalCount) => {
			if (err || totalCount < 0) {
				const response = VacancyResponse.getVacancyError(config.VACANCY, err,);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				VacancyModel.find(filterQuery, '', paginate.query, (err, data) => {
					if (err) {
						const response = databaseError(err);
						logger.error(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = VacancyResponse.getVacancyResponse(config.VACANCY, data);
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
	
	getVacancy: (req, res) => {
		VacancyModel.findById(req.params.id, "", async (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.VACANCY, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.getVacancyResponse(config.VACANCY, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	updateVacancy: (req, res) => {
		VacancyModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}, (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.VACANCY, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.updateVacancy(config.VACANCY, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteVacancy: (req, res) => {
		VacancyModel.findByIdAndDelete(req.params.id, async (err) => {
			if (err) {
				const response = databaseError(err);
				logger.warn(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				await CountController.deleteCountByVacancy(req, res);
			}
		});
	},
}

module.exports = VacancyController;

