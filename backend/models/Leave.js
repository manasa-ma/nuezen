const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  reason: String,
  status: { type: String, default: 'Pending' }
});
module.exports = mongoose.model('Leave', leaveSchema);