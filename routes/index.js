const express = require('express');
const cookieParser = require("cookie-parser")
const postRouter = require('./post.route')
const commentRouter = require('./comment.route')
const usersRouter = require("./user.route");
const loginRouter = require("./login.route")

const router = express.Router();

router.use(cookieParser())
router.use('/signup', usersRouter);
router.use('/login', loginRouter);
router.use('/posts', postRouter);
router.use('/posts/:postId/comments',commentRouter);

module.exports = router;