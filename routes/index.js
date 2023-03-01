const express = require('express');
const postRouter = require('./post.route')
const commentRouter = require('./comment.route')

const router = express.Router();

router.use('/posts', postRouter);
router.use('/posts/:_postId/comments',commentRouter);

module.exports = router;