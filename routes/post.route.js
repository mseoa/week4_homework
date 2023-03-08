const express = require('express');

const router = express.Router();
const loginMiddleware = require("../middlewares/login-middleware");

const Posts = require("../schemas/posts")


//전체 게시글 목록 조회 (끝)
router.get("/", async (req, res) => {
    try {
        const post = await Posts.find({}).sort({ createdAt: -1 });
        const results = post.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                nickname: post.nickname,
                title: post.title,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            }
        })
        res.json({ posts: results });
    } catch (error) {
        res.status(400).json({ "errorMessage" : "게시글 조회에 실패하였습니다." })
    }

})

// 게시글 상세 조회 (끝)
router.get("/:postid", async (req, res) => {
    try {
        const { postid } = req.params
        const post = await Posts.findById(postid)
        const {postId, userId, nickname, title, content, createdAt, updatedAt} = post
        res.json({ post: {postId, userId, nickname, title, content, createdAt, updatedAt} });
    } catch (error) {
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." })
    }
})

// 게시글 작성 (끝)
router.post("/", loginMiddleware, async (req, res) => {
    try {
        const { userId, nickname } = res.locals.user;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다." })
        }
        await Posts.create({ userId, nickname, title, content })
        res.status(201).json({ message: "게시글 작성에 성공하였습니다." })
    } catch (error) {
        res.status(400).json({ "errorMessage" : error.message })
    }
})

// 게시글 수정 (끝)
router.put("/:postid", loginMiddleware, async (req, res) => {
    try {
        const { postid } = req.params;
        const { userId } = res.locals.user
        const post = await Posts.findById(postid)
        if (post.userId!==userId){
            return res.status(403).json({errorMessage: "게시글의 수정 권한이 존재하지 않습니다."})
        }
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글 조회에 실패했습니다." })
        }
        const { title, content } = req.body;
        await Posts.findByIdAndUpdate(postid, {title,content})
        res.status(200).json({ message: "게시글을 수정하였습니다." });

    } catch (error) {
        res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다" })
        //게시글 조회에 실패했습니다
    }
})


// 게시글 삭제 (끝)
router.delete("/:postid", loginMiddleware, async (req, res) => {
    try {
        const { postid } = req.params;
        const { userId } = res.locals.user
        const post = await Posts.findById(postid);
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
        }
        if (post.userId!==userId){
            return res.status(403).json({errorMessage: "게시글의 삭제 권한이 존재하지 않습니다."})
        }
        await Posts.findOneAndDelete({ _id: postid })
        return res.status(200).json({ message: "게시글을 삭제하였습니다." });

    } catch (error) {
        res.status(400).json({ errorMessage: error.message })
    }
})


module.exports = router;