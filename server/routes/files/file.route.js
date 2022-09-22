const express = require('express');
const router = express.Router();
const filesController = require('../../controllers/files/file.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");

router.post('/upload-profile-picture',
	tokenValidators.validateAuth,
	validator("userValidators", "profilePhoto"),
	filesController.uploadProfilePicture
);

router.post('/upload-profile-documents',
	validator("resourceValidators", "document"),
	tokenValidators.validateAuth,
	tokenValidators.clientValidators,
	filesController.uploadDocuments
);

router.get('/fetch-profile-documents',
	tokenValidators.validateAuth,
	filesController.getDocuments
);

router.delete('/delete-profile-documents/:id',
	tokenValidators.validateAuth,
	tokenValidators.clientValidators,
	filesController.deleteDocuments
);

module.exports = router;
