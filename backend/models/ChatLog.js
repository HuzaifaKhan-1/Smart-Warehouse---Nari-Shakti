const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    response: String,
    intent: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
