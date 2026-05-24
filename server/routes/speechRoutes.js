const express = require('express');
const router = express.Router();
const { transcribe } = require('../controllers/speechController');
const { protect } = require('../middleware/authMiddleware');
const { checkUsageLimit } = require('../middleware/rateLimitMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/transcribe', protect, checkUsageLimit, upload.single('audio'), transcribe);

module.exports = router;