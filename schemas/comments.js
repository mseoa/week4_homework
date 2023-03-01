const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
        user: {
            type: String,
            required: true,
        },
        password: {
            type: Number,
            required: true,
          },
        content: {
            type: String,
            required: true,
        },
        _postId: {
            type: String,
            required: true
        }
    },
    {
    timestamps: true
    }
);

module.exports = mongoose.model("Comments", commentsSchema);