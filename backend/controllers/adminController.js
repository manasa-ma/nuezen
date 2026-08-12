const User = require('../models/User');
const Leave = require('../models/Leave');

// @desc    Get Dashboard Overview Stats
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'Employee' });
    const totalHR = await User.countDocuments({ role: 'HR' });
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    
    // Get recent 5 users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalEmployees,
      totalHR,
      pendingLeaves,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};