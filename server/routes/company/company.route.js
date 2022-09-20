const express = require('express');
const router = express.Router();
const CompanyController = require('../../controllers/company/company.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");


router.get('/', tokenValidators.validateAuth, tokenValidators.adminValidators, CompanyController.getAllCompany);
router.get('/:id', tokenValidators.validateAuth, tokenValidators.adminOrCompanyValidators, CompanyController.getCompanyById);
router.put('/:id', tokenValidators.validateAuth, tokenValidators.adminOrCompanyValidators, CompanyController.updateCompany);
router.delete('/:id', tokenValidators.validateAuth, tokenValidators.adminOrCompanyValidators, CompanyController.deleteCompany);

module.exports = router;
