import ActivityLog from "../models/ActivityLog.js";

export const getActivityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      activityType,
      startDate,
      endDate,
      search
    } = req.query;

    // Build query filter
    const filter = {};

    // Filter by activity type
    if (activityType) {
      filter.activityType = activityType;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with population
    let query = ActivityLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const logs = await query;

    // If search term provided, filter results by user name or email
    let filteredLogs = logs;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = logs.filter(log => {
        if (!log.userId) return false;
        const name = log.userId.name?.toLowerCase() || '';
        const email = log.userId.email?.toLowerCase() || '';
        return name.includes(searchLower) || email.includes(searchLower);
      });
    }

    // Get total count for pagination
    const totalLogs = await ActivityLog.countDocuments(filter);

    res.json({
      logs: filteredLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / parseInt(limit)),
        totalLogs,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      message: 'Failed to fetch activity logs',
      error: error.message
    });
  }
};

