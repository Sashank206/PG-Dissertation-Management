import ActivityLog from '../models/ActivityLog.js';

/**
 * Create an activity log entry
 * @param {Object} params - Activity log parameters
 * @param {String} params.userId - User ID
 * @param {String} params.activityType - Type of activity (login, logout, submission, review, update, delete, create, other)
 * @param {String} params.action - Description of the action
 * @param {String} params.ipAddress - IP address of the user
 * @param {String} params.userAgent - User agent string
 * @param {Object} params.details - Additional details
 * @param {String} params.status - Status (success, failure, pending)
 */
export const createActivityLog = async ({
    userId,
    activityType,
    action,
    ipAddress = null,
    userAgent = null,
    details = {},
    status = 'success'
}) => {
    try {
        const log = new ActivityLog({
            userId,
            activityType,
            action,
            ipAddress,
            userAgent,
            details,
            status
        });
        await log.save();
        return log;
    } catch (error) {
        console.error('Error creating activity log:', error);
        // Don't throw error - logging should not break the main flow
        return null;
    }
};

/**
 * Middleware to extract IP address from request
 */
export const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        null;
};

/**
 * Middleware to extract user agent from request
 */
export const getUserAgent = (req) => {
    return req.headers['user-agent'] || null;
};
