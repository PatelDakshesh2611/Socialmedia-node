const usermodel=require("../models/user")
const postmodel=require("../models/post")

const deletecomments=async(req,res)=>{
try{
    // console.log(req.body)
    const resfromdbs=await postmodel.findOne({_id:req.body.postid},{comments:true})
//    console.log(resfromdbs)
    const newcomm=resfromdbs.comments.filter((u)=>{
          return u._id.toString()!==req.body.commentid.toString()
    })
  //   console.log(newcomm)
    const updatecomment=await postmodel.updateOne({_id:req.body.postid},{comments:newcomm})
    // console.log(updatecomment)
    const datatosend=await postmodel.findOne({_id:req.body.postid},{comments:true})
  //   console.log(datatosend)
    res.status(200).json({id:req.body.commentid});
}catch(e){
    res.status(400);
}
}

exports.default=deletecomments