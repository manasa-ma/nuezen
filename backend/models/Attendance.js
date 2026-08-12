const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  date: String,
  time: String
});
module.exports = mongoose.model('Attendance', attendanceSchema);