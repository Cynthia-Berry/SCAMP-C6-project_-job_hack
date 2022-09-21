const ClientModel = require("../../models/users/client.user");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const logger = require("../../middlewares/utils/logger");
const config = require("../../middlewares/helpers/enums/config.enum");
const ResourceController = require("./resource.controller")

const SkillsController = {
	
	creatSkills: (req, res) => {
		ResourceController.creatResource(req, res, config.SKILL)
	},
	
	getAllSkills: (req, res) => {
		ResourceController.getAllResource(req, res, config.SKILL)
	},
	
	getSkills: (req, res) => {
		ResourceController.getResource(req, res, config.SKILL)
	},
	
	updateSkills: (req, res) => {
		ResourceController.updateResource(req, res, config.SKILL)
	},
	
	deleteSkills: (req, res) => {
		ResourceController.deleteResource(req, res, config.SKILL)
	},
	
}
module.exports = SkillsController;
