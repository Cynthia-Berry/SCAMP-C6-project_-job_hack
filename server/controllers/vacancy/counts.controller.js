const config = require("../../middlewares/helpers/enums/config.enum");
const logger = require("../../middlewares/utils/logger");
const CountModel = require("../../models/vacancy/counts");
const VacancyModel = require("../../models/vacancy/counts");
const VacancyResponse = require("../../middlewares/helpers/responses/vacancy.response");
const PaginationService = require("../../middlewares/services/pagination.service");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");


const VacancyController = {
	creatCount: async (req, res, newVacancy) => {
		const countObject = await new CountModel({vacancy: newVacancy.id});
		countObject.save().then(async () => {
			await VacancyModel.findByIdAndUpdate(newVacancy.id, {count: countObject.id}).then(() => {
				const response = VacancyResponse.createVacancy(config.VACANCY, {
					_id: newVacancy.id,
					title: newVacancy.title,
					position: newVacancy.position,
					description: newVacancy.description,
					location: newVacancy.location,
					workType: newVacancy.workType,
					expireDate: newVacancy.expireDate,
					status: newVacancy.status,
					count: {
						total: countObject.total,
						pending: countObject.pending,
						shortlisted: countObject.shortlisted,
						invite: countObject.invite,
						rejected: countObject.rejected,
						approved: countObject.approved,
					},
					company: newVacancy.company,
					createdAt: newVacancy.createdAt,
					updatedAt: newVacancy.updatedAt,
					
				})
				logger.info(response.message);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			});
		}).catch(error => {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	getAllCounts: (req, res) => {
		const paginate = PaginationService.validatePageNo(req);
		const filterQuery = PaginationService.filterPaginateQuery(req);
		
		CountModel.countDocuments(filterQuery, (err, totalCount) => {
			if (err || totalCount < 0) {
				const response = VacancyResponse.getVacancyError(config.COUNTER, err,);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				CountModel.find(filterQuery, '', paginate.query, (err, data) => {
					if (err) {
						const response = databaseError(err);
						logger.error(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = VacancyResponse.getVacancyResponse(config.COUNTER, data);
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
	
	getCounts: (req, res) => {
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
	
	updateCount: (req, res) => {
		CountModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, data) => {
			if (err) {
				const response = VacancyResponse.getVacancyError(config.COUNTER, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.updateVacancy(config.COUNTER, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteCount: (req, res) => {
		CountModel.findByIdAndDelete(req.params.id, async (err) => {
			if (err) {
				const response = databaseError(err);
				logger.warn(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.deleteVacancy(config.COUNTER)
				logger.info(response.message);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteCountByVacancy: (req, res) => {
		CountModel.findOneAndDelete({vacancy: req.params.id}, async (err) => {
			if (err) {
				const response = databaseError(err);
				logger.warn(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = VacancyResponse.deleteVacancy(config.VACANCY)
				logger.info(response.message);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	}
}
module.exports = VacancyController;
