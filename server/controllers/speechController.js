const fs = require('fs');
const { getOpenAIClient } = require('../utils/openaiClient');
const Transcript = require('../models/transcript');
const User = require('../models/user');

const transcribe = async (req, res, next) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required.' });
    }

    const openai = getOpenAIClient();

    const whisperResponse = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'json',
    });

    const transcriptText = whisperResponse.text?.trim();
    if (!transcriptText) {
      return res.status(422).json({ message: 'No speech detected in the audio.' });
    }

    const saved = await Transcript.create({
      userId: req.user._id,
      transcript: transcriptText,
      language: whisperResponse.language || 'en',
      status: 'completed',
    });

    // Atomic increment — avoids race conditions
    await User.findByIdAndUpdate(req.user._id, { $inc: { usageCount: 1 } });

    res.status(200).json({
      success: true,
      data: {
        id: saved._id,
        transcript: saved.transcript,
        language: saved.language,
        wordCount: saved.wordCount,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    // Always delete temp file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err.message);
      });
    }
  }
};

module.exports = { transcribe };