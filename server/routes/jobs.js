const express = require('express');
const Job = require('../models/Job');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Increment views for a job when it is viewed in detail
router.post('/:id/view', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to update job views' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, description, company, location, type, salary, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const userId = req.user?.userId;
    const job = await Job.create({
      title,
      description,
      company,
      location,
      type,
      salary,
      category,
      createdBy: userId,
    });
    res.status(201).json(job);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

module.exports = router;
