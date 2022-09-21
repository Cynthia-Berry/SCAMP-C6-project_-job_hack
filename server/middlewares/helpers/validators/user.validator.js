const Joi = require('joi');

const editAdmin = Joi.object({
	name: Joi.string(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email().trim(),
	phoneNumber: Joi.string().max(15),
	profileImage: Joi.string(),
	role: Joi.string().valid('ADMIN'),
	adminVerified: Joi.boolean()
});

const editClient = Joi.object({
	name: Joi.string(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email().trim(),
	phoneNumber: Joi.string().max(15),
	profileImage: Joi.string(),
	skills: Joi.array(),
	categories: Joi.array(),
	portfolio: Joi.array(),
	educations: Joi.array(),
	applications: Joi.array(),
	role: Joi.string().valid('CLIENT'),
	userVerified: Joi.boolean(),
});

const editCompany = Joi.object({
	name: Joi.string(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email().trim(),
	phoneNumber: Joi.string().max(15),
	website: Joi.string(),
	profileImage: Joi.string(),
	role: Joi.string().valid('COMPANY'),
	verified: Joi.boolean(),
	status: Joi.boolean(),
});

const profilePhoto = Joi.object({
  base64File: Joi.string().base64().required(),
  fileName: Joi.string().required(),
});

module.exports = {editAdmin, editClient, editCompany, profilePhoto}
