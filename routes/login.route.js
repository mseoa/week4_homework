const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../schemas/user");

// 로그인 API
router.post("/", async (req, res) => {
    try {
        const { nickname, password } = req.body;

        const user = await User.findOne({ nickname });

        // 요청된 닉네임이 데이터 베이스에 있는지 찾기
        if (!user) {
            res.status(412).json({
                errorMessage: "닉네임을 확인해주세요",
            });
            return;
        }
        // 닉네임이 있다면 비번이 맞는 비번인지 확인
        if (!bcrypt.compareSync(password, user.password)) {
            // wrong password
            return res.status(422).json({ errorMessage: '비밀번호가 틀렸습니다.' });
        }
            

        const token = jwt.sign(
            { userId: user.userId },
            "custom-secret-key",
        );

        res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
        res.status(200).json({ token }); // JWT를 Body로 할당합니다!
    } catch (error) {
        return res.status(400).json({errorMessage: error.message});
    }

});

module.exports = router;