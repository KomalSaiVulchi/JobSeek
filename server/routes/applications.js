const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Applicant: apply to a job
router.post('/', requireAuth, async (req, res) => {
  const { jobId, resume, coverLetter } = req.body;
  const userId = req.user?.userId;
  if (!jobId || !userId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const existing = await Application.findOne({ job: jobId, applicant: userId });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
      resume,
      coverLetter,
    });
    res.status(201).json({ application });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Get current user's applications
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user?.userId;
  try {
    const applications = await Application.find({ applicant: userId })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Company: get applications for jobs created by the company
router.get('/company', requireAuth, async (req, res) => {
  const userId = req.user?.userId;

  try {
    const jobs = await Job.find({ createdBy: userId }).select('_id');
    const jobIds = jobs.map((j) => j._id);

    if (jobIds.length === 0) {
      return res.json({ applications: [] });
    }

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .populate('applicant')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch company applications' });
  }
});

// Company: update application status
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.userId;

  if (!['accepted', 'rejected', 'pending', 'reviewed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const application = await Application.findById(id).populate('job');
    if (!application || !application.job || String(application.job.createdBy) !== String(userId)) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ application });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Allow applicant to withdraw an application they created
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const application = await Application.findOneAndDelete({ _id: id, applicant: userId });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

module.exports = router;
