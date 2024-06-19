const postmodel=require('../models/post')
const usermodel=require('../models/user')
exports.handlelikes=async(req,res)=>{
    const datafromreact=req.body
    var flag=0
   try{
    const usersdata=await usermodel.findOne({_id:datafromreact.userid})
    const finaldatatosend={
        id:usersdata._id,
        user:{
            image:usersdata.avatar.url,
            name:usersdata.name
        }
    }
    const checkpost=await postmodel.findOne({_id:datafromreact.postid})
    if(checkpost){
   if(datafromreact.status){
    const mongores=await postmodel.updateOne({_id:datafromreact.postid},{$pull:{likes:datafromreact.userid}})
    flag=0
    
   }else{
     const mongores=await postmodel.updateOne({_id:datafromreact.postid},{$push:{likes:datafromreact.userid}})
     flag=1
   }
   if(flag===0){
    res.status(200).json({message:'delete'})
   }else{
    res.status(200).json({message:'add',data:finaldatatosend})
   }
}
else{
    res.status(200).json({message:'post deleted'})
}
   } catch(e){
    
    res.sendStatus(400)
   }
   
}