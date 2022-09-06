const mongoose = require("mongoose");
const { Schema } = mongoose;


const companyUserSchema = new Schema({

}, {timestamps: true});

const CompanyUsers = mongoose.model('CompanyUsers', companyUserSchema);
module.exports = CompanyUsers;
