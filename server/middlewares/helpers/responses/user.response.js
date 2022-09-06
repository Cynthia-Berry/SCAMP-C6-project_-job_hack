const successCodes = require("../enums/successCodes.enum");
const errorCodes = require("../enums/errorCodes.enum");


const UserResponse = {
	getUserResponse() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `User fetched Successfully`
		};
	},
	
	createUserResponse() {
		return {
			status: successCodes.Success201.code, type: successCodes.Success201.type,
			message: `User Created Successfully`
		};
	},
 
	updateUserResponse() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `User resources and information updated successfully`
		};
	},
	
	deleteUserResponse() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `User resources and information deleted successfully`
		};
	},
	
	getUserExistError() {
		return {
			status: errorCodes.Error409.code, type: errorCodes.Error409.type,
			message: `User Already Exist. Please Login!`
		}
	},
	
	userNotFoundError() {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: `No record found, User resource and information does not exist`
		}
	},
	
	getUserError() {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: 'Error retrieving/Create user at this time'
		}
	}
 
}

module.exports = UserResponse;
