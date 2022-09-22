const express = require('express');
const router = express.Router();
const applicationController = require('../../controllers/vacancy/application.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.post('/',
	validator("vacancyValidators", "createApplication"),
	tokenValidators.validateAuth,
	tokenValidators.clientValidators,
	applicationController.creatApplication
);

router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	applicationController.getApplication
);

router.get('/:id',
	tokenValidators.validateAuth,
	applicationController.getApplication
);
router.put('/:id',
	validator("vacancyValidators", "editApplicationStatus"),
	tokenValidators.validateAuth,
	tokenValidators.companyValidators,
	applicationController.updateApplication
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.clientValidators,
	applicationController.deleteApplication
);

module.exports = router;
