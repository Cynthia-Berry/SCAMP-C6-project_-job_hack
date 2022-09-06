const {mongoose} = require('mongoose');

const adminTokenModelSchema = mongoose.Schema({
	token: {type: String, required: true},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'AdminUsers', required: true},
}, {timestamps: true});

const AdminTokenModel = mongoose.model('AdminTokens', adminTokenModelSchema);

module.exports = AdminTokenModel;
