const ClientUserController = require("../users/client.user.controller");
const CategoryController = require("../resources/category.controller");
const DocumentController = require("../resources/document.controller");
const EducationController = require("../resources/education.controller");
const SkillsController = require("./skill.controller");
const ApplicationController = require("../vacancy/application.controller");
const config = require("../../middlewares/helpers/enums/config.enum");
const PaginationService = require("../../middlewares/services/pagination.service");
const CategoryModel = require("../../models/resources/category.resources");
const EducationModel = require("../../models/resources/education.resources");
const SkillModel = require("../../models/resources/skill.resource");
const DocumentModel = require("../../models/resources/document.resource");
const ResourceResponse = require("../../middlewares/helpers/responses/resource.response");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const logger = require("../../middlewares/utils/logger");

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
	
	updateUserResources: async (req, res) => {
		const id = req.params.id;
		let newPortfolio = [], newDocuments = [], newSkills = [],
			newEducations = [], newCategories = [], newApplications = [];
		
		if ("portfolio" in req.body) {
			newPortfolio = newPortfolio.concat(req.body.portfolio);
			delete req.body.portfolio;
			await ClientUserController.updateUserPortfolio(id, newPortfolio);
		}
		if ("documents" in req.body) {
			newDocuments = newDocuments.concat(req.body.documents);
			delete req.body.documents;
			await DocumentController.updateUserDocuments(id, newDocuments);
		}
		if ("skills" in req.body) {
			newSkills = newSkills.concat(req.body.skills);
			delete req.body.skills;
			await SkillsController.updateUserSkills(id, newSkills);
		}
		if ("educations" in req.body) {
			newEducations = newEducations.concat(req.body.educations);
			delete req.body.educations;
			await EducationController.updateUserEducation(id, newEducations);
		}
		if ("categories" in req.body) {
			newCategories = newCategories.concat(req.body.categories);
			delete req.body.categories;
			await CategoryController.updateUserCategory(id, newCategories);
		}
		if ("applications" in req.body) {
			newApplications = newApplications.concat(req.body.applications);
			delete req.body.applications;
			await ApplicationController.updateUserApplication(id, newApplications);
		}
	},
}

module.exports = ResourceController;


