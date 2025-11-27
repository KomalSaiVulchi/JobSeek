const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyProfile: user.companyProfile || null,
      applicantProfile: user.applicantProfile || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const { companyProfile, applicantProfile, name } = req.body;
    const update = {};
    if (name) update.name = name;
    if (companyProfile) update.companyProfile = companyProfile;
    if (applicantProfile) update.applicantProfile = applicantProfile;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: update },
      { new: true }
    ).lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyProfile: user.companyProfile || null,
      applicantProfile: user.applicantProfile || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
