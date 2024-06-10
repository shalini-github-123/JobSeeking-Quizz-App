// models/Job.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  recruiter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  officeName: { type: String, required: true },
  location: { type: String, required: true },
  modeOfWork: { type: String, required: true },
  requirements: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  minimumDuration: { type: Number, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: false }
});

module.exports = mongoose.model('Job', JobSchema);