const express = require('express');
const router = express.Router();
const CompanyAuthController = require('../../controllers/auths/company.auth.controller');
const validator = require("../../middlewares/services/validator.service");


router.post('/login', validator("authValidators", "userLogin"), CompanyAuthController.signIn);
router.post('/register', validator("authValidators", "createUser"), CompanyAuthController.signUp);

module.exports = router;
