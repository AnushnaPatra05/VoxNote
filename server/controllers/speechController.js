const fs = require('fs');
const OpenAI = require('openai');

const Transcript = require('../models/transcript');
const User = require('../models/user');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const transcribe = async (req, res) => {
  const filePath = req.file?.path;

  try {
    console.log('Incoming file:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required',
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const whisperResponse = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-large-v3',
      response_format: 'verbose_json',
      temperature: 0,
    });

    console.log('Whisper Response:', whisperResponse);

    const transcriptText = whisperResponse.text?.trim();

    if (!transcriptText) {
      return res.status(422).json({
        success: false,
        message: 'No speech detected in audio.',
      });
    }

    const savedTranscript = await Transcript.create({
      userId: req.user._id,
      transcript: transcriptText,
      language: whisperResponse.language || 'en',
      status: 'completed',
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        usageCount: 1,
      },
    });

    return res.status(200).json({
      success: true,

      data: {
        id: savedTranscript._id,
        transcript: savedTranscript.transcript,
        language: savedTranscript.language,
        createdAt: savedTranscript.createdAt,
      },
    });
  } catch (error) {
    console.error('TRANSCRIPTION ERROR:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    return res.status(500).json({
      success: false,
      message: error.message || 'Transcription failed',
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, err => {
        if (err) {
          console.error('File cleanup failed:', err.message);
        }
      });
    }
  }
};

module.exports = { transcribe };