const logger = require("../../middlewares/utils/logger");
const ResourceController = require("./resource.controller");
const ClientModel = require("../../models/users/client.user");
const config = require("../../middlewares/helpers/enums/config.enum");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");

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
	
	updateUserCategory: (id, newCategories) => {
		ClientModel.findOneAndUpdate({_id: id}, {$push: {categories: newCategories}}, {new: true}, async (err, data) => {
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
module.exports = CategoryController;
