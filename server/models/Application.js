const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String },
    coverLetter: { type: String },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
