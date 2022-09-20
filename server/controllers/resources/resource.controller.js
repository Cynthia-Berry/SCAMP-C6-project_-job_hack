const ClientUserController = require("../users/client.user.controller");
const CategoryController = require("../resources/category.controller");
const DocumentController = require("../resources/document.controller");
const EducationController = require("../resources/education.controller");
const SkillsController = require("../resources/skills.controller");
const ApplicationController = require("../vacancy/application.controller");
const config = require("../../middlewares/helpers/enums/config.enum");

const ResourceController = {
	
	updateResource: async (req, res) => {
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


