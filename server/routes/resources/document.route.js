const express = require('express');
const router = express.Router();
const documentController = require('../../controllers/resources/document.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.post('/',
	validator("resourceValidators", "document"),
	tokenValidators.validateAuth,
	tokenValidators.adminOrCompanyValidators,
	documentController.creatDocument
);
router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	documentController.getAllDocuments
);
router.get('/:id',
	tokenValidators.validateAuth,
	documentController.getDocument
);
router.put('/:id',
	validator("resourceValidators", "document"),
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	documentController.updateDocument
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	documentController.deleteDocument
);

module.exports = router;
