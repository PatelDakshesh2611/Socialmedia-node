const usermodel=require('../models/user')

exports.getnotification=async(req,res)=>{
   try{
    const userpartialfollowers=await usermodel.findOne({_id:req.params.id},{partialfollowers:1})
    const notifications=await Promise.all(userpartialfollowers.partialfollowers.map(async(u)=>{
           const notidata=await usermodel.findOne({_id:u},{avatar:1,name:1})
           return notidata
    }))
    res.status(200).json({notidata:notifications})
   }catch(e){
      res.status(400)
   }
}