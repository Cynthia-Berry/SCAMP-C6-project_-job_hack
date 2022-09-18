const express = require('express');
const router = express.Router();
const AdminAuthController = require('../../controllers/auths/admin.auth.controller');
const validator = require("../../middlewares/services/validator.service");


router.post('/login', validator("authValidators", "adminLogin"), AdminAuthController.signIn);
router.post('/register', validator("authValidators", "createUser"), AdminAuthController.signUp);

module.exports = router;
