const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10 // 10자리인 솔트를 먼저 만듦, 이 솔트를 이용해서 비밀번호 암호화

const UserSchema = new mongoose.Schema({
  nickname: { // nickname 필드
    type: String,
    required: true,
    unique: true,
  },
  password: { // password 필드
    type: String,
    required: true,
  },
});

// 가상의 userId 값을 할당
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

// user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')){
  //비밀번호를 암호화시킨다
    bcrypt.genSalt(saltRounds,function(err,salt){
      if(err) return next(err)
      // 솔드를 제대로 생성했다면
      bcrypt.hash(user.password,salt,function(err,hash){
        if (err) return next(err)
        // 해시(암호화된 비번)만드는데 성공했다면
        user.password = hash
        next()
      })
    })
  } else { // 비밀번호를 바꿀때가 아니라 다른걸 바꿀때에는
      next()
  }
})

module.exports = mongoose.model("User", UserSchema);