const User = require('../models/user');

const PLAN_LIMITS = {
  free: 5,
  pro: Infinity,
};

const checkUsageLimit = async (req, res, next) => {
  try {
    const user = req.user;
    await user.resetDailyUsageIfNeeded();

    const limit = PLAN_LIMITS[user.planType] ?? 5;

    if (user.usageCount >= limit) {
      return res.status(429).json({
        message: `Daily limit reached. Free plan allows ${limit} transcriptions/day.`,
        usageCount: user.usageCount,
        limit,
        planType: user.planType,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUsageLimit };