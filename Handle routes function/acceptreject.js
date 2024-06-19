const usermodel=require('../models/user')
exports.acceptreject=async(req,res)=>{
 try{
    const friend=await usermodel.findOne({_id:req.body.friendid},{partialfollowers:1,partialfollowing:1})
    if(friend && req.body.requestfor=='accept'){
      const updatemyfollowers=await usermodel.updateOne({_id:req.body.myid},{$push:{followers:req.body.friendid}})
      const updatefriendfollowing=await usermodel.updateOne({_id:req.body.friendid},{$push:{following:req.body.myid}})
  
      const updatemypartialfollowers1=await usermodel.updateOne({_id:req.body.myid},{$pull:{partialfollowers:req.body.friendid}})
      const updatepartialfriendfollowing1=await usermodel.updateOne({_id:req.body.friendid},{$pull:{partialfollowing:req.body.myid}})
      res.status(200).json({message:'ok'})
    }else if(friend && req.body.requestfor=='reject'){
        const updatemypartialfollowers1=await usermodel.updateOne({_id:req.body.myid},{$pull:{partialfollowers:req.body.friendid}})
        const updatepartialfriendfollowing1=await usermodel.updateOne({_id:req.body.friendid},{$pull:{partialfollowing:req.body.myid}})
        res.status(200).json({message:'ok'})
    }else{
      const updatemypartialfollowers1=await usermodel.updateOne({_id:req.body.myid},{$pull:{partialfollowers:req.body.friendid}})
        res.status(200).json({message:'notok'})
    }
 }catch(e){
    res.status(400)
 }

}