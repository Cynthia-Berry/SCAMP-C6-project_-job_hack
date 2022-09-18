const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require("moment");
const {WorkType} = require("../../middlewares/helpers/enums/models.enum");
const Schema = mongoose.Schema;

const vacancySchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	location: {
		type: String
	},
	workType: {
		type: String,
		required: true,
		enum: Object.values(WorkType)
	},
	expireDate: {
		type: Date,
		default: moment().add(3, "months")
	},
	count: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'VacancyCount'
	},
	status: {
		type: Boolean,
		required: true,
		default: true
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true
	}
}, {
	timestamps: true
});

vacancySchema.plugin(uniqueValidator);
const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = Vacancy;
