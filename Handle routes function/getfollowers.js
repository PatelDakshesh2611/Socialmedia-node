const usermodel=require('../models/user')

exports.getfollowers=async(req,res)=>{
   try{
      const id=req.params.id
      const userdata=await usermodel.findOne({_id:id},{followers:1,following:1})
      const following=await Promise.all(userdata.following.map(async(u)=>{
            const tempdata=await usermodel.findOne({_id:u},{avatar:1,name:1})
            const data={
               image:tempdata.avatar.url,
               name:tempdata.name,
               id:tempdata._id
            }
            return data
      }))
      const followers=await Promise.all(userdata.followers.map(async(u)=>{
         const tempdata=await usermodel.findOne({_id:u},{avatar:1,name:1})
         const data={
            image:tempdata.avatar.url,
            name:tempdata.name,
            id:tempdata._id
         }
         return data
   }))
      res.status(200).json({followers,following})
   }catch(e){
res.status(400)
   }
} 