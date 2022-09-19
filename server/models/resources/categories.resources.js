const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const CategoriesResourcesSchema = new Schema({
	sector: {
		type: String,
		required: true,
		unique: true,
	},
	specialization: {
		type: String,
		required: true,
		unique: true,
	}
}, {
	timestamps: true
});

CategoriesResourcesSchema.plugin(uniqueValidator);
const SkillsResources = mongoose.model('CategoriesResources', CategoriesResourcesSchema);

module.exports = SkillsResources;
