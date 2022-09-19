const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const adminUserModelSchema = new Schema({
	adminId: {
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
		default: 'ADMIN'
	},
	adminVerified: {
		type: Boolean,
		required: true,
		default: false
	}
}, {timestamps: true});


adminUserModelSchema.plugin(uniqueValidator);
const AdminUserModel = mongoose.model('AdminUsers', adminUserModelSchema);

module.exports = AdminUserModel;
