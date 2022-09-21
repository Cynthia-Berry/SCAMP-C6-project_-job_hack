const express = require('express');
const router = express.Router();
const skillsController = require('../../controllers/resources/skill.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.post('/',
	validator("resourceValidators", "skills"),
	tokenValidators.validateAuth,
	skillsController.creatSkills
);
router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	skillsController.getAllSkills
);
router.get('/:id',
	tokenValidators.validateAuth,
	skillsController.getSkills
);
router.put('/:id',
	validator("resourceValidators", "skills"),
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	skillsController.updateSkills
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	skillsController.deleteSkills
);

module.exports = router;
