const usermodel=require('../models/user')
exports.followandunfollow=async(req,res)=>{
  try{
   const followdata=req.body
   const user=await usermodel.findOne({_id:followdata.followid})
   if(user){
   const mydata=await usermodel.findOne({_id:followdata.myid},{partialfollowers:1,partialfollowing:1})
   const partialfollowers=mydata.partialfollowers
   const partialfollowing=mydata.partialfollowing
   const ispartialfollower=(partialfollowers)=>{
        let status=false;
        partialfollowers.map((u)=>{
            if(JSON.stringify(u)==JSON.stringify(followdata.followid)){
               status=true
            }
        })
        return status
   }
  
   if(ispartialfollower(partialfollowers)){
      res.status(200).json({message:'alreadyrequested'})
   }else{
      const changeresult = await usermodel.updateOne(
         { _id: followdata.myid },
         { $push: { partialfollowing: followdata.followid } }
       );
       
       const changeresult1 = await usermodel.updateOne(
         { _id: followdata.followid },
         { $push: { partialfollowers: followdata.myid } }
       );
       res.status(200).json({message:'requestsent'})
   }}else{
      res.status(200).json({message:'usernotfound'})
   }
  }catch(e){
   res.status(400)
  }
    
}