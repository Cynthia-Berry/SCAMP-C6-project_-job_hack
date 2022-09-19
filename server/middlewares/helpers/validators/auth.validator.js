const Joi = require('joi');
const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;


const clientLogin = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required(),
});

const adminLogin = Joi.object({
	adminId: Joi.string().required(),
	password: Joi.string().required(),
});

const companyLogin = Joi.object({
	companyId: Joi.string().required(),
	password: Joi.string().required(),
});

const createUser = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().required().email().trim(),
	phoneNumber: Joi.string().max(15).required(),
	password: Joi.string().min(8).required().pattern(new RegExp(pattern)).messages({
		"string.min": `Password should have a minimum length of 8 characters`,
		"string.base": `Password should have an uppercase, lowercase, and digit`,
		"string.pattern.base": "Password should have an uppercase, lowercase, and digit",
		"string.empty": `Password cannot be empty`,
		"string.required": `Password is a required`
	}),
});

const createCompany = Joi.object({
	name: Joi.string().required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().required().email().trim(),
	phoneNumber: Joi.string().max(15).required(),
	website: Joi.string().required(),
	password: Joi.string().min(8).required().pattern(new RegExp(pattern)).messages({
		"string.min": `Password should have a minimum length of 8 characters`,
		"string.base": `Password should have an uppercase, lowercase, and digit`,
		"string.pattern.base": "Password should have an uppercase, lowercase, and digit",
		"string.empty": `Password cannot be empty`,
		"string.required": `Password is a required`
	}),
});


module.exports = {clientLogin, adminLogin, companyLogin, createUser, createCompany}
