const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const skillResourcesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
});

skillResourcesSchema.plugin(uniqueValidator);
const SkillsResources = mongoose.model('SkillsResources', skillResourcesSchema);

module.exports = SkillsResources;
