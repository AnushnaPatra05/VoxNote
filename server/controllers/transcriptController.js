const Transcript = require('../models/transcript');

const getTranscripts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [transcripts, total] = await Promise.all([
      Transcript.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-userId'),
      Transcript.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      data: transcripts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTranscript = async (req, res, next) => {
  try {
    const deleted = await Transcript.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Transcript not found.' });
    }

    res.status(200).json({ success: true, message: 'Transcript deleted.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transcript ID.' });
    }
    next(error);
  }
};

module.exports = { getTranscripts, deleteTranscript };