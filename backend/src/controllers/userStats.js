const User = require('../models/user.model')


const getUserStats = async (req, res) => {
  try {
    console.log('req.user:', req.user);  

    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      problemsSolved: user.problemSolved?.length || 0,
      lecturesCompleted: user.lecturesCompleted?.length || 0,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
};

module.exports = getUserStats;