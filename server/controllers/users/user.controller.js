const AdminModel = require('../../models/users/admin.user');
const ClientModel = require('../../models/users/client.user');
const CompanyModel = require('../../models/users/company.user');
const config = require("../../middlewares/helpers/enums/config.enum");
const UserResponse = require('../../middlewares/helpers/responses/user.response')
const {databaseError} = require("../../middlewares/helpers/responses/database.response");


let UserModel;
const UserController = {
	getUserById: (req, res, type) => {
		const id = req.params.id;
		const userType = type === config.PROFILE ? res.locals.tokenOwner.role : type;
		UserModel = (userType === config.ADMIN || userType === config.SUPER_ADMIN) ? AdminModel :
			(userType === config.COMPANY || userType === config.COMPANY_ADMIN) ? CompanyModel : ClientModel;
		UserModel.findById(id, "-password -documents", async (err, data) => {
			console.log('data', data)
			console.log('err', err)
			if (err) {
        const response = databaseError(err);
        res.status(response.status).json({status: response.type, message: response.message});
      }else{
				const response = UserResponse.getUserResponse(data);
          res.status(response.status).json({status: response.type, message: response.message, data: response.data});
			}
		});
	},
	
	deleteUser: (req, res, userType) => {
		const id = req.params.id;
		console.log(userType)
		UserModel = (userType === config.ADMIN) ? AdminModel : (userType === config.COMPANY || userType === config.COMPANY_ADMIN) ? CompanyModel : ClientModel;
		UserModel.findByIdAndDelete(id, async (err) => {
			if (err) {
				const response = databaseError(err);
				res.status(response.status).json({status: response.type, message: response.message});
			} else {
				const response = deleteUserSuccess(userType);
				res.status(response.status).json({status: response.type, message: response.message});
			}
		})
	}
}


module.exports = UserController;
