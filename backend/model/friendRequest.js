const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    fromUser:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const FrinedRequests = mongoose.model('FrinedRequests', friendRequestSchema);
module.exports = FrinedRequests;