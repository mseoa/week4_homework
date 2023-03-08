const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        nickname: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true
        }
    },
    {
    timestamps: true
    }
);

commentsSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
  });
  
  // user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
  commentsSchema.set("toJSON", {
    virtuals: true,
  });

module.exports = mongoose.model("Comments", commentsSchema);