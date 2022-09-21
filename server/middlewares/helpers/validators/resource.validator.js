const Joi = require('joi');

const category = Joi.object({
	sector: Joi.string().required(),
	category: Joi.array().unique(),
});

const education = Joi.object({
	educationLevel: Joi.string().required(),
	name: Joi.string().required(),
	courseOfStudy: Joi.string().required(),
	startYear: Joi.string().required(),
	endYear: Joi.string().required(),
	description: Joi.string().required(),
	userId: Joi.string().required(),
});

const skills = Joi.object({
	name: Joi.string().required(),
});

const document = Joi.object({
	base64File: Joi.string().base64().required(),
	fileName: Joi.string().required(),
	documentType: Joi.string().required().valid('CV', 'PORTFOLIO', 'COVER_LETTER', 'CERTIFICATION', 'OTHERS'),
});

module.exports = {category, education, skills, document}
