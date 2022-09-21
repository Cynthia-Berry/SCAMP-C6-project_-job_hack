const AdminModel = require('../../models/users/admin.user');
const CompanyModel = require('../../models/company/company');
const ClientModel = require('../../models/users/client.user');
const DocumentModel = require('../../models/resources/document.resource');
const config = require('../../middlewares/helpers/enums/config.enum');
const UploadService = require('../../middlewares/services/upload.service');
const FileResponse = require('../../middlewares/helpers/responses/file.response');
const UserResponse = require('../../middlewares/helpers/responses/user.response');
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const PaginationService = require('../../middlewares/services/pagination.service');
const successCodes = require('../../middlewares/helpers/enums/successCodes.enum')


let UserModel;
const FilesController = {
	getExpectedFileName: res => {
		const userType = res.locals.tokenOwner.role;
		return userType === config.CLIENT ? `${res.locals.tokenOwner.userId}` :
			userType === config.ADMIN ? res.locals.tokenOwner.adminId :
				userType === config.COMPANY ? res.locals.tokenOwner.companyId : null;
	},
	
	uploadProfilePicture: async (req, res) => {
		const name = FilesController.getExpectedFileName(res);
		const file = req.body;
		const fileRes = await UploadService.uploadBase64String(file, name, config.FILE_IMAGE);
		if (fileRes.status === successCodes.Success200.code) {
			const id = res.locals.tokenOwner.id;
			const userType = res.locals.tokenOwner.role;
			
			UserModel = userType === config.COMPANY ? CompanyModel : userType === config.ADMIN ? AdminModel : userType === config.CLIENT ? ClientModel : null;
			
			UserModel.findByIdAndUpdate(id, {"profileImage": fileRes.data}, {new: true}, err => {
				if (err) {
					const response = databaseError(err);
					res.status(response.status).json({status: response.type, message: response.message});
				} else {
					res.status(fileRes.status).json({status: fileRes.type, message: fileRes.message, data: fileRes.data});
				}
			});
		} else {
			res.status(fileRes.status).json({status: fileRes.type, message: fileRes.message});
		}
	},
	
	uploadProfileDocuments: async (req, res) => {
		const name = FilesController.getExpectedFileName(res);
		const file = req.body;
		const fileRes = await UploadService.uploadBase64String(file, name, config.FILE_DOCUMENT);
		
		if (fileRes.status === successCodes.Success200.code) {
			const id = res.locals.tokenOwner.id;
			const options = {upsert: true, new: true, setDefaultsOnInsert: true};
			const newDocument = {name: req.body.fileName, documentType: req.body.documentType, url: fileRes.data, user: id};
			
			DocumentModel.findOneAndUpdate({url: newDocument.url}, newDocument, options, async (err, document) => {
				if (err) {
					const response = databaseError(err);
					res.status(response.status).json({status: response.type, message: response.message});
				} else {
					ClientModel.findOneAndUpdate({_id: id}, {$addToSet: {documents: document}}, options, err => {
						if (err) {
							const response = databaseError(err, config.FILE_DOCUMENT);
							res.status(response.status).json({status: response.type, message: response.message});
						} else {
							res.status(fileRes.status).json({status: fileRes.type, message: fileRes.message, data: fileRes.data});
						}
					});
				}
			});
		} else {
			res.status(fileRes.status).json({status: fileRes.type, message: fileRes.message});
		}
	},
 
	getProfileDocuments: (req, res) => {
		req.query.user = res.locals.tokenOwner.id;
		const paginate = PaginationService.validatePageNo(req, res);
		const filterQuery = PaginationService.filterPaginateQuery(req);
		DocumentModel.countDocuments(filterQuery, (err, totalCount) => {
			if (err || totalCount < 0) {
				const response = databaseError(err);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				DocumentModel.find(filterQuery, "-user", paginate.query, async (err, documents) => {
					if (err) {
						const response = databaseError(err);
						res.status(response.status).json({status: response.type, message: response.message});
					} else {
						for (const forEach of documents) forEach.url = await UploadService.fetchFileSignedUrl(forEach.url);
						const pages = Math.ceil(totalCount / paginate.pageSize);
						const response = FileResponse.fetchFileSuccess();
						res.status(response.status).json({
							status: response.type, message: response.message, count: totalCount, pageNo: paginate.pageNo,
							pages: pages, data: documents
						});
					}
				});
			}
		});
	},
	
	deleteProfileDocuments: async (req, res) => {
		const doc_id = req.params.id;
		const clientId = res.locals.tokenOwner.id;
		DocumentModel.findByIdAndDelete(doc_id, {}, err => {
			if (err) {
				const response = databaseError(err);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				ClientModel.findByIdAndUpdate(clientId, {$pull: {documents: doc_id}}, {new: true}, (err, clientData) => {
					if (err) {
						const dbResponse = databaseError(err);
						res.status(dbResponse.status).json({status: dbResponse.type, message: dbResponse.message})
					} else {
						const response = UserResponse.updateUserSuccess(clientData, config.CLIENT);
						res.status(response.status).json({status: response.type, message: response.message});
					}
				});
				
			}
		});
	}
	
}

module.exports = FilesController;
