const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    planType: { type: String, enum: ['free', 'pro'], default: 'free' },
    usageCount: { type: Number, default: 0 },
    usageResetDate: { type: Date, default: () => new Date(new Date().setHours(0,0,0,0)) },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.resetDailyUsageIfNeeded = async function () {
  const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));
  if (this.usageResetDate < todayMidnight) {
    await this.constructor.findByIdAndUpdate(this._id, {
      usageCount: 0,
      usageResetDate: todayMidnight,
    });
    this.usageCount = 0;
    this.usageResetDate = todayMidnight;
  }
};

module.exports = mongoose.model('User', userSchema);
