const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const authTokenSchema = new Schema({
	token: {
		type: String,
		required: true
	},
	expireDate: {
		type: Date,
		default: moment().add(2, "hour")
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: 'UsersRef'
	},
	UsersRef: {
		type: String,
		required: true,
		enum: ['AdminUsers', 'ClientUsers', 'CompanyUsers']
	},
}, {timestamps: true});


authTokenSchema.plugin(uniqueValidator);
const AuthTokenModel = mongoose.model('AuthTokens', authTokenSchema);

module.exports = AuthTokenModel;
