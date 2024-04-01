const db = require('../model/index');
const Analytics = db.Analytics;

const GetAnalyticsData = async (req, res) => {
  try {
    const { totalGames, activeUsers, revenue, gameId, userId } = req.query;

    const existingGame = await db.Game.findByPk(gameId);
    const existingUser = await db.User.findByPk(userId);


    console.log('existingGame:', existingGame);
    console.log('existingUser:', existingUser);

    if (!existingGame || !existingUser) {
      return res.status(400).json({ message: 'Invalid gameId or userId. Game or User not found.' });
    }
    const whereCondition = {};
    if (gameId) whereCondition.gameId = gameId;
    if (userId) whereCondition.userId = userId;

    const analyticsData = await Analytics.findAll({
      where: {
        totalGames: totalGames || null,
        activeUsers: activeUsers || null,
        revenue: revenue || null,
        gameId: gameId || null,
        userId: userId || null,
      },
    });

    res.status(201).json({ success: 1, analyticsData });
  } catch (error) {onse
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: 0, message: 'Error fetching analytics data', error: error.message });
  }
};

module.exports = { GetAnalyticsData };