const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/auths/admin.auth.controller');
const validator = require("../../middlewares/services/validator.service");


router.post('/register', validator("authValidators", "createAdmin"), adminAuthController.signUp);
router.post('/login', validator("authValidators", "login"), adminAuthController.signIn);

module.exports = router;
