const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/users/client.user.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");


router.get('/', tokenValidators.validateAuth, tokenValidators.adminValidators, clientController.getAllClients);
router.get('/:id', tokenValidators.validateAuth, clientController.getClientById);
router.put('/:id', tokenValidators.validateAuth, tokenValidators.adminOrClientValidators, clientController.updateClient);
router.delete('/:id', tokenValidators.validateAuth, tokenValidators.adminOrClientValidators, clientController.deleteClient);

module.exports = router;
