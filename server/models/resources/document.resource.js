const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {documentType} = require("../../middlewares/helpers/enums/models.enum");
const Schema = mongoose.Schema;

const documentResourcesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    required: true,
    enum: Object.values(documentType)
  },
  url: {
    required: true,
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientUsers',
    required: true
  }
}, {
  timestamps: true
});

documentResourcesSchema.plugin(uniqueValidator);
const DocumentsResources = mongoose.model('DocumentsResources', documentResourcesSchema);

module.exports = DocumentsResources;
