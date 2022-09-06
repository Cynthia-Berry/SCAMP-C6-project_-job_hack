const {mongoose} = require('mongoose');

const clientUserSchema = mongoose.Schema({}, {timestamps: true});

const ClientUsers = mongoose.model('ClientUsers', clientUserSchema);

module.exports = ClientUsers;
