const Notification = require('../model/notifications');

async function createNotification({ senderId, recipientIds, type, message }){
    try{
        console.log('Recipient IDs:', recipientIds);

        await Notification.create({
            sender: senderId,
            recipient: recipientIds,
            type: type,
            notification: message
        });
    }
    catch(error){
        console.error('Error creating notification:', error.message);
    }
}

module.exports = createNotification;