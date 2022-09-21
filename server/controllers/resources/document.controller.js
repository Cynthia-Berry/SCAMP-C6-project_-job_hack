const config = require("../../middlewares/helpers/enums/config.enum")
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
}
module.exports = DocumentController;
