const express = require('express');
const router = express.Router();
const { getTranscripts, deleteTranscript } = require('../controllers/transcriptController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getTranscripts);
router.delete('/:id', deleteTranscript);

module.exports = router;