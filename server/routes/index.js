const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Welcome to JOB HACK,',
		description: 'SheCodes-Africa Project - API Infrastructure to handle clients search for a job that is relevant to their domain or area of interest.'
	});
});

module.exports = router;
