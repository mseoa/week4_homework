const express = require('express');

const router = express.Router({mergeParams: true}); //index.js의 _postId를 params로 갖고오기 위해

const Comments = require("../schemas/comments")

// 댓글 생성
router.post("/", async (req, res) => {
    try {
        const {_postId} = req.params;
        const { user,password,content } = req.body;
        if (!content){
            return res.status(404).json({message: "댓글 내용을 입력해주세요."})
        }
        await Comments.create({user, password, content, _postId})
        res.json({ message: "댓글을 생성하였습니다." })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
})

//댓글 목록 조회
router.get("/", async (req, res) => {
    try {
        const {_postId} = req.params;
        const comment = await Comments.find({_postId:_postId}).sort({createdAt: -1}) ;
        const results = comment.map((comment)=>{
        return {
            commentId: comment._id,
            user: comment.user,
            content: comment.content,
            createdAt: comment.createdAt
        }
        })
        res.json({data: results});
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
})



//댓글 수정
router.put("/:_commentId", async (req, res) => {
    try {
        const {password, content} = req.body;
        if (!password){
            return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        if (!content){
            return res.status(400).json({message: "댓글 내용을 입력해주세요."})
        }
        const {_commentId} = req.params;
        const comment = await Comments.findById(_commentId)

        if (!comment){
            return res.status(404).json({message: "댓글 조회에 실패했습니다."})
        }

        if (comment.password === password) {
            await Comments.findByIdAndUpdate(_commentId, {
                        content: content
                        });
        } else {
            return res.status(401).json({message:"비밀번호가 일치하지 않습니다."})
        }
        res.status(200).json({message: "댓글을 수정하였습니다."});
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})


//댓글 삭제
router.delete("/:_commentId", async(req,res)=>{
    try {
        const {_commentId} = req.params;
        const comment = await Comments.findById(_commentId);
        if (!comment){
            return res.status(404).json({message: "댓글 조회에 실패했습니다."})
        }
        const {password} = req.body;
        if (!password){
            return res.status(404).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        if (comment.password === password) {
            await Comments.findOneAndDelete({_id:_commentId})
        } else {
            return res.status(401).json({message:"비밀번호가 일치하지 않습니다."})
        }
        return res.status(200).json({message: "게시글을 삭제하였습니다."});

    } catch (error) {
        res.status(400).json({message:error.message})
    }
  })


module.exports=router;