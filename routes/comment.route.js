const express = require('express');

const router = express.Router({mergeParams: true}); //index.js의 _postId를 params로 갖고오기 위해
const loginMiddleware = require("../middlewares/login-middleware");
const Comments = require("../schemas/comments")
const Posts = require("../schemas/posts")

// 댓글 생성
router.post("/", loginMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, nickname } = res.locals.user;
        const { comment } = req.body;
        const post = await Posts.findById(postId)
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
        }
        if (!comment){
            return res.status(404).json({errorMessage: "댓글 내용을 입력해주세요."})
        }
        await Comments.create({postId, userId, nickname, comment})
        res.status(201).json({ message: "댓글을 작성하였습니다." })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." })
    }
})

//댓글 목록 조회
router.get("/", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Posts.findById(postId)
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
        }

        const comment = await Comments.find({postId}).sort({createdAt: -1}) ;
        const results = comment.map((comment)=>{
        return {
            commentId:comment.commentId,
            userId: comment.userId,
            nickname: comment.nickname,
            comment: comment.comment,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }
        })
        res.json({comments: results});
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." })
    }
})



//댓글 수정
router.put("/:commentId", loginMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params;
        const post = await Posts.findById(postId)
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
        }
        const existComment = await Comments.findById(commentId)
        if (!existComment){
            return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."})
        }
        if (existComment.userId!==userId){
            return res.status(403).json({errorMessage: "게시글의 수정 권한이 존재하지 않습니다."})
        }
        if (!comment){
            return res.status(400).json({errorMessage: "댓글 내용을 입력해주세요."})
        }

        await Comments.findByIdAndUpdate(commentId, { comment: comment });
        res.status(200).json({message: "댓글을 수정하였습니다."});

    } catch (error) {
        console.log(error.message)
        res.status(400).json({errorMessage: "댓글 수정에 실패하였습니다."})
    }
})


//댓글 삭제
router.delete("/:commentId", loginMiddleware, async(req,res)=>{
    try {
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params;
        const post = await Posts.findById(postId)
        if (!post) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." })
        }
        const existComment = await Comments.findById(commentId)
        if (!existComment){
            return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."})
        }
        if (existComment.userId!==userId){
            return res.status(403).json({errorMessage: "게시글의 삭제 권한이 존재하지 않습니다."})
        }
        await Comments.findOneAndDelete({ _id : commentId })
        return res.status(200).json({message: "댓글을 삭제하였습니다."});

    } catch (error) {
        console.log(error.message)
        res.status(400).json({errorMessage: "댓글 삭제에 실패하였습니다."})
    }
  })


module.exports=router;