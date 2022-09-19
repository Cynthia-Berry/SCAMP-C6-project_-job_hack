const express = require('express');
const router = express.Router();
const CompanyController = require('../../controllers/company/company.controller');
const validator = require("../../middlewares/services/validator.service");


router.get('/', validator("authValidators", "userLogin"), CompanyController.getAllCompany);
router.get('/:id', validator("authValidators", "createUser"), CompanyController.getCompanyById);
router.put('/:id', validator("authValidators", "createUser"), CompanyController.updateCompany);
router.delete('/:id', validator("authValidators", "createUser"), CompanyController.deleteCompany);

module.exports = router;
