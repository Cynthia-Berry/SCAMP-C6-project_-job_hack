const express = require('express');
const router = express.Router();
const countController = require('../../controllers/vacancy/counts.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	countController.getAllCounts
);
router.get('/:id',
	tokenValidators.validateAuth,
	tokenValidators.adminOrCompanyValidators,
	countController.getCounts
);
router.put('/:id',
	validator("vacancyValidators", "count"),
	tokenValidators.validateAuth,
	tokenValidators.companyValidators,
	countController.updateCount
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.companyValidators,
	countController.deleteCount
);

module.exports = router;
