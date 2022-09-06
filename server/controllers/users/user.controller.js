const AdminModel = require('../../models/users/admin.user');
const ClientModel = require('../../models/users/client.user');
const CompanyModel = require('../../models/users/company.user');
const config = require("../../middlewares/helpers/enums/config.enum");


let UserModel;
const UserController = {
	getUserById: (req, res, type) => {
		const id = req.params.id;
		const userType = type === config.PROFILE ? res.locals.tokenOwner.role : type;
		UserModel = (userType === config.ADMIN || userType === config.SUPER_ADMIN) ? AdminModel :
			(userType === config.COMPANY || userType === config.COMPANY_ADMIN) ? CompanyModel : ClientModel;
		UserModel.findById(id, "-password -documents", async (err, data) => {
		
		});
	},
}


module.exports = UserController;
