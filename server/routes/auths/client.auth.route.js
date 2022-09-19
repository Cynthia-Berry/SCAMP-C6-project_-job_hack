const express = require('express');
const router = express.Router();
const ClientAuthController = require('../../controllers/auths/client.auth.controller');
const validator = require("../../middlewares/services/validator.service");


router.post('/login', validator("authValidators", "userLogin"), ClientAuthController.signIn);
router.post('/register', validator("authValidators", "createUser"), ClientAuthController.signUp);

module.exports = router;
