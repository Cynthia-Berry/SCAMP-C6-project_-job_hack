const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/users/admin.user.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.get('/', validator("authValidators", "createAdmin"), adminAuthController.signUp);
router.get('/:id', validator("authValidators", "createAdmin"), adminAuthController.signUp);
router.delete('/:id',
	  tokenValidators.validateAuth, adminAuthController.signIn);

module.exports = router;
