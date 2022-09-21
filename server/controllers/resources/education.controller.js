const ResourceController = require("./resource.controller");
const config = require("../../middlewares/helpers/enums/config.enum");

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
	
}
module.exports = EducationController;
