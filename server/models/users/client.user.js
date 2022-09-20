const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {Genders, Portfolio} = require("../../middlewares/helpers/enums/models.enum");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
	name: {
		type: String,
		required: true,
		enum: Object.values(Portfolio)
	},
	url: {
		required: true,
		type: String
	}
});

const clientUserSchema = new Schema({
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
	gender: {
		type: String,
		enum: Object.values(Genders),
	},
	nationality: {
		type: String,
	},
	description: {
		type: String,
	},
	coverLetter: {
		type: String,
	},
	currentSalary: {
		type: String,
	},
	expectedSalary: {
		type: String,
	},
	portfolio: [portfolioSchema],
	documents: [{
		type: mongoose.Types.ObjectId,
		ref: 'DocumentsResources'
	}],
	educations: [{
		type: mongoose.Types.ObjectId,
		ref: 'EducationResources'
	}],
	skills: [{
		type: mongoose.Types.ObjectId,
		ref: 'SkillsResources'
	}],
	categories: [{
		type: mongoose.Types.ObjectId,
		ref: 'CategoriesResources'
	}],
	applications: [{
		type: mongoose.Types.ObjectId,
		ref: 'Application'
	}],
	role: {
		type: String,
		required: true,
		default: 'CLIENT'
	},
	userVerified: {
		type: Boolean,
		required: true,
		default: false
	},
}, {timestamps: true});


clientUserSchema.plugin(uniqueValidator);
const ClientUsers = mongoose.model('ClientUsers', clientUserSchema);

module.exports = ClientUsers;
