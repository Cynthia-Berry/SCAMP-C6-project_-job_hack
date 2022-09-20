const successCodes = require("../enums/successCodes.enum");
const errorCodes = require("../enums/errorCodes.enum");


const UserResponse = {
	getUserResponse (userType, data) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${userType} profile fetched Successfully`, data: data
		};
	},
	
	createUserResponse(userType, data) {
		return {
			status: successCodes.Success201.code, type: successCodes.Success201.type,
			message: `${userType} Created Successfully`, data: data
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
	
	deleteUserSuccess: type => {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} deleted successfully`
		};
	},
	
	getUserExistError(type) {
		return {
			status: errorCodes.Error409.code, type: errorCodes.Error409.type,
			message: `${type} Already Exist. Please Login!`
		}
	},
	
	userNotFoundError(type) {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: `No record found, ${type} resource and information does not exist`
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
