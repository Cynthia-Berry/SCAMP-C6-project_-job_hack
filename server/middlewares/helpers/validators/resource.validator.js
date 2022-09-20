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
	name: Joi.string().required(),
	documentType: Joi.string().required(),
	url: Joi.string().required(),
	userId: Joi.string().required(),
});

module.exports = {category, education, skills, document}
