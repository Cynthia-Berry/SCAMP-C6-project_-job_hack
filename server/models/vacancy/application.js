const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {JobStatus} = require("../../middlewares/helpers/enums/models.enum");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  coverLetter: {
    type: String,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentsResources',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "PENDING",
    enum: Object.values(JobStatus)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientUsers',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  vacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy',
    required: true
  }
}, {
  timestamps: true
});

applicationSchema.plugin(uniqueValidator);
const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
