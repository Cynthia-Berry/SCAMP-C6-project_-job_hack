const successCodes = require("../enums/successCodes.enum");
const errorCodes = require("../enums/errorCodes.enum");


const ResourceResponse = {
	createResource(type, data) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} created Successfully`, data: data
		};
	},
	getResourceResponse(type, data) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} profile fetched Successfully`, data: data
		};
	},
	getResourceError: (type, error) => {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: `Error occurred, could not fetch ${type.toLowerCase()} resources (${error})`
		};
	},
	deleteResource(type) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} deleted Successfully`
		};
	},
}

module.exports = ResourceResponse;
