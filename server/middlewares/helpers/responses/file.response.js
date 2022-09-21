const errorCodes = require("../enums/errorCodes.enum");
const successCodes = require("../enums/successCodes.enum");

const FileResponse = {
	uploadFileError() {
		return {
			status: errorCodes.Error501.code, type: errorCodes.Error501.type,
			message: `Unable to upload image, something went wrong`, data: null
		};
	},
	
	uploadFileSuccess(url) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `File upload successful`, data: url
		};
	},
	
	fetchFileSuccess() {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `File upload successful`
		};
	}
}

module.exports = FileResponse;
