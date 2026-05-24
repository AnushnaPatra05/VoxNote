const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    planType: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    usageResetDate: {
      type: Date,
      default: () => new Date(new Date().setHours(0, 0, 0, 0)),
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Reset daily usage if new day
userSchema.methods.resetDailyUsageIfNeeded = async function () {
  const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));
  if (this.usageResetDate < todayMidnight) {
    this.usageCount = 0;
    this.usageResetDate = todayMidnight;
    await this.save();
  }
};

module.exports = mongoose.model('User', userSchema);