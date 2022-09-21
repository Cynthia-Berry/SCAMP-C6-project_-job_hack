const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/resources/category.controller');
const tokenValidators = require("../../middlewares/helpers/validators/token.validator");
const validator = require("../../middlewares/services/validator.service");


router.post('/',
	validator("resourceValidators", "category"),
	tokenValidators.validateAuth,
	categoryController.creatCategory
);
router.get('/',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	categoryController.getAllCategories
);
router.get('/:id',
	tokenValidators.validateAuth,
	categoryController.getCategory
);
router.put('/:id',
	validator("resourceValidators", "category"),
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	categoryController.updateCategory
);
router.delete('/:id',
	tokenValidators.validateAuth,
	tokenValidators.adminValidators,
	categoryController.deleteCategory
);

module.exports = router;
