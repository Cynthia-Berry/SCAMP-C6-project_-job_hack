const ClientModel = require("../../models/users/client.user");
const logger = require("../../middlewares/utils/logger");
const config = require("../../middlewares/helpers/enums/config.enum");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const ResourceController = require("./resource.controller");


const DocumentController = {
	
	creatDocument: (req, res) => {
		ResourceController.creatResource(req, res, config.FILE_DOCUMENT)
	},
	
	getAllDocuments: (req, res) => {
		ResourceController.getAllResource(req, res, config.FILE_DOCUMENT)
	},
	
	getDocument: (req, res) => {
		ResourceController.getResource(req, res, config.FILE_DOCUMENT)
	},
	
	updateDocument: (req, res) => {
		ResourceController.updateResource(req, res, config.FILE_DOCUMENT)
	},
	
	deleteDocument: (req, res) => {
		ResourceController.deleteResource(req, res, config.FILE_DOCUMENT)
	},
	
	updateUserDocuments: (id, newDocuments) => {
		ClientModel.findOneAndUpdate({_id: id}, {$push: {documents: newDocuments}}, {new: true}, async (err, data) => {
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
module.exports = DocumentController;
