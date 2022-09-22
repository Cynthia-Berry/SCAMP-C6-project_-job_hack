const Joi = require('joi');

const createVacancy = Joi.object({
	title: Joi.string().required(),
	position: Joi.string().required(),
	description: Joi.string().required(),
	location: Joi.string().required(),
	workType: Joi.string().required().valid('ONSITE', 'HYBRID', 'REMOTE'),
});

const editVacancy = Joi.object({
	status: Joi.boolean(),
	title: Joi.string(),
	position: Joi.string(),
	description: Joi.string(),
	location: Joi.string(),
	workType: Joi.string().required().valid('ONSITE', 'HYBRID', 'REMOTE'),
});

const count = Joi.object({
	total: Joi.number().integer(),
	pending: Joi.number().integer(),
	shortlisted: Joi.number().integer(),
	invite: Joi.number().integer(),
	rejected: Joi.number().integer(),
	approved: Joi.number().integer(),
});

const createApplication = Joi.object({
	vacancy: Joi.string().required(),
});

const editApplicationStatus = Joi.object({
	status: Joi.string().valid('PENDING', 'SHORTLIST', 'INVITE', 'APPROVED', 'REJECTED'),
});


module.exports = {createVacancy, editVacancy, count, createApplication, editApplicationStatus}
