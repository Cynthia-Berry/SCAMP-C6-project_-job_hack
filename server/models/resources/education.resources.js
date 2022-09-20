const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const educationResourcesSchema = new Schema({
	educationLevel: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	courseOfStudy: {
		type: String,
		required: true,
	},
	startYear: {
		type: String,
	},
	endYear: {
		type: String,
	},
	description: {
		type: String,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ClientUsers',
		required: true
	}
}, {
	timestamps: true
});

educationResourcesSchema.plugin(uniqueValidator);
const EducationResources = mongoose.model('EducationResources', educationResourcesSchema);

module.exports = EducationResources;
