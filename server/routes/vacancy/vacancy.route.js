const express = require('express');
const router = express.Router();
const vacancyController = require('../../controllers/vacancy/vacancy.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.post('/',
	validator("vacancyValidators", "createVacancy"),
	tokenValidators.validateAuth,
	tokenValidators.companyValidators,
	vacancyController.creatVacancy
);
router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminOrClientValidators,
	vacancyController.getAllVacancy
);
router.get('/:id',
	tokenValidators.validateAuth,
	vacancyController.getVacancy
);
router.put('/:id',
	validator("vacancyValidators", "editVacancy"),
	tokenValidators.validateAuth,
	tokenValidators.companyValidators,
	vacancyController.updateVacancy
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.adminOrCompanyValidators,
	vacancyController.deleteVacancy
);

module.exports = router;
