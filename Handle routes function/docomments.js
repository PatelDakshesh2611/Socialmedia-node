const postmodel=require('../models/post')
const usermodel=require('../models/user')
exports.docomments=async(req,res)=>{
    try{
      const mognooseres=await postmodel.findOne({_id:req.body.postid})
      if(mognooseres){//this if is execute if the post exist else not
        const datafromuser=req.body
    const resfrommongo=await postmodel.findOneAndUpdate({_id:datafromuser.postid},{$push:{comments:{users:datafromuser.userid,comment:datafromuser.comment}}},{new:true})
    //getting data of user
    const resfrommongos=await usermodel.findOne({_id:datafromuser.userid})
    const comment=resfrommongo.comments
    const finalcomment=comment[comment.length-1]
    // till this point we have all info to send just we have to set according to frontend
    const finalrestosend={
        id:finalcomment._id,
        user:{
            image:resfrommongos.avatar.url,
            name:resfrommongos.name,

        },
        content:finalcomment.comment,
        userid:finalcomment.users
    }
    res.status(200).json(finalrestosend)
      }
    else{
         res.status(200).json({message:'post deleted'})
      }

    }catch(e){
        res.sendStatus(400)
    }
    
}