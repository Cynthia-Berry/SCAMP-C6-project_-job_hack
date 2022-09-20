const ClientModel = require("../../models/users/client.user");
const {databaseError} = require("../../middlewares/helpers/responses/database.response");
const logger = require("../../middlewares/utils/logger");
const config = require("../../middlewares/helpers/enums/config.enum");

const SkillsController = {
	updateUserSkills: (id, newSkills) => {
		ClientModel.findOneAndUpdate({_id: id}, {$push: {skills: newSkills}}, {new: true}, async (err, data) => {
			if (err) {
				const response = databaseError(err);
				logger.error(response);
			} else {
				const response = updateUserSuccess(data, config.CLIENT);
				logger.info(response);
			}
		});
	},
}
module.exports = SkillsController;
