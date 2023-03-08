const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true
    },
    nickname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
  timestamps: true
  }
);

postsSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});

// user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
postsSchema.set("toJSON", {
  virtuals: true,
});


module.exports = mongoose.model("Posts", postsSchema);