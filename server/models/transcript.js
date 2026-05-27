const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    transcript: {
      type: String,
      required: [true, 'Transcript content is required'],
      trim: true,
    },
    audioFileUrl: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
    },
    language: {
      type: String,
      default: 'en',
      trim: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for performance
transcriptSchema.index({ transcript: 'text' });
transcriptSchema.index({ userId: 1, createdAt: -1 });

// Auto word count
transcriptSchema.pre('save', function () {
  if (this.isModified('transcript') && this.transcript) {
    this.wordCount = this.transcript.trim().split(/\s+/).length;
  }
});

module.exports = mongoose.model('Transcript', transcriptSchema);