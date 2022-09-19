const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/company.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");


router.get('/', tokenValidators.validateAuth, tokenValidators.adminValidators, companyController.getAllCompany);
router.get('/:id', tokenValidators.validateAuth, companyController.getCompanyById);
router.put('/:id', tokenValidators.validateAuth, tokenValidators.adminOrCompanyValidators, companyController.updateCompany);
router.delete('/:id', tokenValidators.validateAuth, tokenValidators.adminOrCompanyValidators, companyController.deleteCompany);

module.exports = router;
