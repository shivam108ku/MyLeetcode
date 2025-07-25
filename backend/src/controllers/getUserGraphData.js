const Submission = require('../models/submmision.model');
const mongoose = require('mongoose');

const getUserGraphData = async (req, res) => {
  try {
    const userId = req.result?._id || req.user?._id; // fallback for jwt middlewares
    if (!userId) return res.status(400).json({ message: "User ID not provided" });

    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setUTCDate(today.getUTCDate() - 6);

    
    const submissions = await Submission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          submittedAt: { $gte: start, $lt: new Date(today.getTime() + 24*60*60*1000) }, // up to end of today
        }
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt", timezone: "UTC" } },
          },
          dailyScore: { $sum: 1 }
        }
      },
      {
        $project: {
          day: "$_id.day",
          dailyScore: 1,
          _id: 0
        }
      },
      {
        $sort: { day: 1 }
      }
    ]);

   
    const dayScores = {};
    submissions.forEach(d => { dayScores[d.day] = d.dailyScore; });

    const response = [];
    let cumulative = 0;
    let currentDate = new Date(start);

    for (let i = 0; i < 7; i++) {
      const y = currentDate.getUTCFullYear();
      const m = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
      const d = String(currentDate.getUTCDate()).padStart(2, "0");
      const key = `${y}-${m}-${d}`;
      const todayScore = dayScores[key] || 0;
      cumulative += todayScore;

      response.push({ day: key, score: cumulative, dailyScore: todayScore });

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Graph Data Error:", error);
    res.status(500).json({ message: "Failed to fetch graph data", error: error.message });
  }
};

 
// controllers/leaderboard.controller.js
 

const getDailyLeaderboard = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setUTCHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setUTCDate(targetDate.getUTCDate() + 1);

    const dailyLeaders = await Submission.aggregate([
      {
        $match: {
          submittedAt: { $gte: targetDate, $lt: nextDate },
        },
      },
      {
        $group: {
          _id: "$userId",
          dailyScore: { $sum: 1 },
        },
      },
      { $sort: { dailyScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users", // use collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          dailyScore: 1,
          // Combine firstName and lastName for display
          name: {
            $trim: {
              input: {
                $concat: [
                  "$user.firstName",
                  " ",
                  { $ifNull: ["$user.lastName", ""] }
                ]
              }
            }
          },
          email: "$user.emailId",
          profile_img: "$user.profile_img",
        },
      },
    ]);

    res.status(200).json(dailyLeaders);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch daily leaderboard", error: error.message });
  }
};

 

 





module.exports = {getUserGraphData,getDailyLeaderboard}
