const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const companySchema = new Schema({
	companyId: {
		type: String,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true,
		dropDups: true,
		trim: true,
	},
	name: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true,
		lowercase: true,
		dropDups: true,
		trim: true,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
	},
	phoneNumber: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	teamSize: {
		type: String
	},
	website: {
		type: String
	},
	description: {
		type: String
	},
	city: {
		type: String
	},
	country: {
		type: String
	},
	additionalInformation: {
		type: String
	},
	profileImage: {
		type: String,
		required: true,
		default: "profile/default__profile"
	},
	role: {
		type: String,
		required: true,
		default: 'COMPANY'
	},
	verified: {
		type: Boolean,
		required: true,
		default: false
	},
	status: {
		type: Boolean,
		required: true,
		default: false
	},
}, {
	timestamps: true
});

companySchema.plugin(uniqueValidator);
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
