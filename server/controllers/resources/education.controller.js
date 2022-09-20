const logger = require("../../middlewares/utils/logger");
const ResourceController = require("./resource.controller");
const ClientModel = require("../../models/users/client.user");
const config = require("../../middlewares/helpers/enums/config.enum");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");

const EducationController = {
	creatEducation: (req, res) => {
		ResourceController.creatResource(req, res, config.EDUCATION)
	},
	
	getAllEducation: (req, res) => {
		ResourceController.getAllResource(req, res, config.EDUCATION)
	},
	
	getEducation: (req, res) => {
		ResourceController.getResource(req, res, config.EDUCATION)
	},
	
	updateEducation: (req, res) => {
		ResourceController.updateResource(req, res, config.EDUCATION)
	},
	
	deleteEducation: (req, res) => {
		ResourceController.deleteResource(req, res, config.EDUCATION)
	},
	
	updateUserEducation: (id, newEducation) => {
		ClientModel.findOneAndUpdate({_id: id}, {$push: {educations: newEducation}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
}
module.exports = EducationController;
