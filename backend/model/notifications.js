const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    notification: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum : [ 'like', 'comment', 'post', 'friend_request_deleted', 'friend_request_accepted', 'friend_request_received', 'delete_post', 'delete_comment', 'upload' ],
        required: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true,
});
// jinki id type array me hogi unhe delete button dikhana hai
// jinki hogi unhe dikhana hai delete button
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;