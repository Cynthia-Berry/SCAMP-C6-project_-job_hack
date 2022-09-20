const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auths/auth.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");

router.get('/logout',
  tokenValidators.validateAuth, authController.logout
);

module.exports = router;
