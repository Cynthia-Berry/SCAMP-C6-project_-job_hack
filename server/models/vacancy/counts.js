const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const vacancyCountSchema = new Schema({
  total: {
    type: Number,
    required: true,
    default: 0
  },
  pending: {
    type: Number,
    required: true,
    default: 0
  },
  shortlisted: {
    type: Number,
    required: true,
    default: 0
  },
  invite: {
    type: Number,
    required: true,
    default: 0
  },
  rejected: {
    type: Number,
    required: true,
    default: 0
  },
  approved: {
    type: Number,
    required: true,
    default: 0
  },
  vacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy',
    required: true
  }
}, {
  timestamps: true
});

vacancyCountSchema.plugin(uniqueValidator);
const VacancyCount = mongoose.model('VacancyCount', vacancyCountSchema);

module.exports = VacancyCount;
