const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/users/admin.user.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");


router.get('/', tokenValidators.validateAuth, tokenValidators.adminValidators, adminController.getAllAdmins);
router.get('/:id', tokenValidators.validateAuth, tokenValidators.adminValidators, adminController.getAdminById);
router.put('/:id', tokenValidators.validateAuth, tokenValidators.adminValidators, adminController.updateAdmin);
router.delete('/:id', tokenValidators.validateAuth, tokenValidators.adminValidators, adminController.deleteAdmin);

module.exports = router;
