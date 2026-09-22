const mongo = require('mongoose');

const UrlSchema = new mongo.Schema({
    userId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

    count: {
        type: Number,
        default: 0,
    },

});

module.exports = mongo.model('Url', UrlSchema);