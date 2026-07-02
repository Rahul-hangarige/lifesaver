const Notification = require('../models/Notification');

const sendNotification = async (io, recipientId, recipientRole, title, message, type, priority = 'medium', actionRequired = false, actionLink = null, relatedId = null) => {
  try {
    const notification = new Notification({
      recipientId,
      recipientRole,
      title,
      message,
      type,
      priority,
      actionRequired,
      actionLink,
      relatedId
    });

    await notification.save();

    // Send real-time notification via Socket.IO
    io.to(recipientId.toString()).emit('notification', {
      _id: notification._id,
      title,
      message,
      type,
      priority,
      actionRequired,
      actionLink
    });

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

module.exports = sendNotification;
