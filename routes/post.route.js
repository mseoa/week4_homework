const express = require('express');

const router = express.Router();

const Posts = require("../schemas/posts")


//전체 게시글 목록 조회
router.get("/", async (req, res) => {
    const post = await Posts.find({}).sort({createdAt: -1}) ;
    const results = post.map((post)=>{
        return {
            postId: post._id,
            user: post.user,
            title: post.title,
            createdAt: post.createdAt
        }
    })
    res.json({data: results});
})

// 게시글 조회
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const post = await Posts.findById(id)
        const { _id, user, title, content, createdAt } = post;
        res.json({ data: { postId: _id, user, title, content, createdAt } });
    } catch (error) {
        res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})
    }
})

// 게시글 작성
router.post("/", async (req, res) => {
    try {
        await Posts.create(req.body) //패스워드 유니크로 안했는데 안바꾸면 400 에러
        res.json({ message: "게시글을 생성하였습니다." })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
})

// 게시글 수정 req password title content / res 게시글을 수정하였습니다 에러는
// body 또는 params를 입력 받지 못한 경우 -> 400 데이터 형식이 올바르지 않습니다
// _postId에 해당하는 게시글이 존재하지 않을 경우 -> 404 게시글 조회에 실패하였습니다
// api를 호출할 때 입력된 비밀번호를 비교하여 동일할때만 글이 수정되게 하기
router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Posts.findById(id)
        if (!post){
            return res.status(404).json({message: "게시글 조회에 실패했습니다."})
        }
        const {password, title, content} = req.body;
       
        if (post.password === password) {
            await Posts.findByIdAndUpdate(id, {
                        title: title,
                        content: content
                        }); 
            // await Posts.updateOne(
            //  조건,
            //     {$set: {title:title},{content:content}}
            //     )
        } else {
            return res.status(401).json({message:"비밀번호가 일치하지 않습니다."})
        }
        // res.status(200).json({message: "게시글을 수정하였습니다."});
        
        res.status(200).json({message: "게시글을 수정하였습니다."});
    } catch (error) {
        res.status(400).json({message:error.message})
        //게시글 조회에 실패했습니다
    }
})


// 게시글 삭제
router.delete("/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const post = await Posts.findById(id);
        if (!post){
            return res.status(404).json({message: "게시글 조회에 실패했습니다."})
        }
        const {password} = req.body;
        if (post.password === password) {
            await Posts.findOneAndDelete({_id:id})
        } else {
            return res.status(401).json({message:"비밀번호가 일치하지 않습니다."})
        }
        return res.status(200).json({message: "게시글을 삭제하였습니다."});

    } catch (error) {
        res.status(400).json({message:error.message})
    }
    res.json({result:"success"});
  })


module.exports = router;