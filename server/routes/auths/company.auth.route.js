const express = require('express');
const router = express.Router();
const CompanyAuthController = require('../../controllers/auths/company.auth.controller');
const validator = require("../../middlewares/services/validator.service");


router.post('/login', validator("authValidators", "companyLogin"), CompanyAuthController.signIn);
router.post('/register', validator("authValidators", "createCompany"), CompanyAuthController.signUp);

module.exports = router;
