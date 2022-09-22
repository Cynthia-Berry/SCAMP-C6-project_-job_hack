const successCodes = require("../enums/successCodes.enum");
const errorCodes = require("../enums/errorCodes.enum");


const VacancyResponse = {
	createVacancy(type, data) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} created Successfully`, data: data
		};
	},
	getVacancyResponse(type, data) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} profile fetched Successfully`, data: data
		};
	},
	
	getVacancyError: (type, error) => {
		return {
			status: errorCodes.Error400.code, type: errorCodes.Error400.type,
			message: `Error occurred, could not fetch ${type.toLowerCase()} resources (${error})`
		};
	},
	updateVacancy: (type, data) => {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} updated Successfully`, data: data
		};
	},
	deleteVacancy(type) {
		return {
			status: successCodes.Success200.code, type: successCodes.Success200.type,
			message: `${type} deleted Successfully`
		};
	},
}

module.exports = VacancyResponse;
