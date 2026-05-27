const User = require('../models/user');

const PLAN_LIMITS = {
  free: 10,
  pro: Infinity,
};

const checkUsageLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const limit = PLAN_LIMITS[user.plan || 'free'];

    if (user.usageCount >= limit) {
      return res.status(403).json({
        success: false,
        message: 'Daily transcription limit reached',
      });
    }

    next();
  } catch (error) {
    console.error('Rate limit middleware error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  checkUsageLimit,
};