const ResourceController = require("./resource.controller");
const config = require("../../middlewares/helpers/enums/config.enum");

const CategoryController = {
	creatCategory: (req, res) => {
		ResourceController.creatResource(req, res, config.CATEGORY);
	},
	
	getAllCategories: (req, res) => {
		ResourceController.getAllResource(req, res, config.CATEGORY);
	},
	
	getCategory: (req, res) => {
		ResourceController.getResource(req, res, config.CATEGORY);
	},
	
	updateCategory: (req, res) => {
		ResourceController.updateResource(req, res, config.CATEGORY);
	},
	
	deleteCategory: (req, res) => {
		ResourceController.deleteResource(req, res, config.CATEGORY);
	},
	
}
module.exports = CategoryController;
