const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


const companyUserSchema = new Schema({
	companyId: {
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
		unique: true
	},
	password: {
		type: String,
		required: true
	},
		profileImage: {
		type: String,
		required: false,
		default: "default__profile"
	},
	role: {
		type: String,
		required: true,
		default: 'COMPANY'
	},
	userVerified: {
		type: Boolean,
		required: true,
		default: false
	},
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
		required: true
	},
}, {timestamps: true});


companyUserSchema.plugin(uniqueValidator);
const CompanyUsers = mongoose.model('CompanyUsers', companyUserSchema);

module.exports = CompanyUsers;
