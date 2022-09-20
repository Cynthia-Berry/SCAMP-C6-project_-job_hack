const express = require('express');
const router = express.Router();
const educationController = require('../../controllers/resources/education.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.post('/',
	validator("resourceValidators", "education"),
	tokenValidators.validateAuth,
	tokenValidators.adminOrCompanyValidators,
	educationController.creatEducation
);
router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	educationController.getAllEducation
);
router.get('/:id',
	tokenValidators.validateAuth,
	educationController.getEducation
);
router.put('/:id',
	validator("resourceValidators", "education"),
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	educationController.updateEducation
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	educationController.deleteEducation
);

module.exports = router;
