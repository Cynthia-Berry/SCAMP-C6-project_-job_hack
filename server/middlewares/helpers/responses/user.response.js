const successCodes = require("../enums/successCodes.enum");
const errorCodes = require("../enums/errorCodes.enum");


const UserResponse = {
	getUserResponse(data) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `User profile fetched Successfully`, data: data
		};
	},
	
	createUserResponse() {
		return {
			status: successCodes.Success201.code, type: successCodes.Success201.type,
			message: `User Created Successfully`
		};
	},
	
	updateUserForbidden: type => {
		return {
			status: errorCodes.Error401.code, type: errorCodes.Error401.type,
			message: `Error occurred, could not update the ${type.toLowerCase()} information`
		};
	},
	
	updateUserSuccess: (data, type) => {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} information successfully updated`, data: data
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
	
	getUserError: (error, type) => {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: `Error occurred, could not fetch ${type.toLowerCase()} resources`
		};
	}
	
}

module.exports = UserResponse;
