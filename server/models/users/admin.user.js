const {mongoose} = require('mongoose');

const adminUserModelSchema = mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	firstName: {type: String,},
	lastName: {type: String, required: true},
	email: {type: String, unique: true, lowercase: true},
	phone: {type: String, unique: true,},
	password: {type: String, required: true},
	profileImage: {type: String},
	role: {type: String, required: true, default: 'ADMIN'},
	status: {type: Boolean, required: true, default: false},
}, {timestamps: true});

const AdminUserModel = mongoose.model('AdminUsers', adminUserModelSchema);

module.exports = AdminUserModel;
