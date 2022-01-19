const express = require('express');

const processImage = require('./process-image');

const router = express.Router();

router.use('/process-image', processImage);

module.exports = router;
