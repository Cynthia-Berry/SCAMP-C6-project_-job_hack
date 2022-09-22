const logger = require("../../middlewares/utils/logger");
const SkillModel = require("../../models/resources/skill.resource");
const config = require("../../middlewares/helpers/enums/config.enum");
const DocumentModel = require("../../models/resources/document.resource");
const CategoryModel = require("../../models/resources/category.resources");
const EducationModel = require("../../models/resources/education.resources");
const PaginationService = require("../../middlewares/services/pagination.service");
const ResourceResponse = require("../../middlewares/helpers/responses/resource.response");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const UserResponse = require("../../middlewares/helpers/responses/user.response");


let ResourcesModel;

const ResourceController = {
	creatResource: async (req, res, resourceType) => {
		ResourcesModel = resourceType === config.CATEGORY ? CategoryModel : resourceType === config.EDUCATION ? EducationModel :
			resourceType === config.SKILL ? SkillModel : resourceType === config.FILE_DOCUMENT ? DocumentModel : null;
		
		const resourceObject = await new ResourcesModel(req.body);
		resourceObject.save().then(() => {
			const response = ResourceResponse.createResource(resourceType, resourceObject)
			logger.info(response.message);
			res.status(response.status).json({status: response.type, message: response.message, data: response.data});
		}).catch(error => {
			const response = databaseError(error);
			logger.error(response.message);
			res.status(response.status).json({status: response.type, message: response.message});
		})
	},
	
	getAllResource: (req, res, resourceType) => {
		const paginate = PaginationService.validatePageNo(req);
		const filterQuery = PaginationService.filterPaginateQuery(req);
		ResourcesModel = resourceType === config.CATEGORY ? CategoryModel : resourceType === config.EDUCATION ? EducationModel :
			resourceType === config.SKILL ? SkillModel : resourceType === config.FILE_DOCUMENT ? DocumentModel : null;
		
		ResourcesModel.countDocuments(filterQuery, (err, totalCount) => {
			if (err || totalCount < 0) {
				const response = ResourceResponse.getResourceError(resourceType, err,);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				ResourcesModel.find(filterQuery, '', paginate.query, (err, data) => {
					if (err) {
						const response = databaseError(err);
						logger.error(response.message)
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = ResourceResponse.getResourceResponse(resourceType, data);
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
	
	getResource: (req, res, resourceType) => {
		ResourcesModel = resourceType === config.CATEGORY ? CategoryModel : resourceType === config.EDUCATION ? EducationModel :
			resourceType === config.SKILL ? SkillModel : resourceType === config.FILE_DOCUMENT ? DocumentModel : null;
		
		ResourcesModel.findById(req.params.id, "", async (err, data) => {
			if (err) {
				const response = ResourceResponse.getResourceError(resourceType, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = ResourceResponse.getResourceResponse(resourceType, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	updateResource: (req, res, resourceType) => {
		ResourcesModel = resourceType === config.CATEGORY ? CategoryModel : resourceType === config.EDUCATION ? EducationModel :
			resourceType === config.SKILL ? SkillModel : resourceType === config.FILE_DOCUMENT ? DocumentModel : null;
		ResourcesModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, data) => {
			if (err) {
				const response = ResourceResponse.getResourceError(userType, err);
				logger.error(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = ResourceResponse.updateResource(resourceType, data);
				logger.info(response.message)
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteResource: (req, res, resourceType) => {
		ResourcesModel = resourceType === config.CATEGORY ? CategoryModel : resourceType === config.EDUCATION ? EducationModel :
			resourceType === config.SKILL ? SkillModel : resourceType === config.FILE_DOCUMENT ? DocumentModel : null;
		
		ResourcesModel.findByIdAndDelete(req.params.id, async (err) => {
			if (err) {
				const response = databaseError(err);
				logger.warn(response.message)
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = ResourceResponse.deleteResource(resourceType)
				logger.info(response.message);
				res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
}

module.exports = ResourceController;


