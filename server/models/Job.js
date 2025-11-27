const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String },
    views: { type: Number, default: 0 },
    location: { type: String },
    type: { type: String },
    salary: { type: String },
    category: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
