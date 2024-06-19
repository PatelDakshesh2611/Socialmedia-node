const usermodel=require('../models/user')

exports.login=async(req,res)=>{
   const logindata=req.body
   try{
      const databseres=await usermodel.findOne(logindata)
      if(databseres){
         res.status(200).json({message:'ok',data:databseres})
      }
      else{
         res.status(200).json({message:'not a user'})
      }
   }
   catch{
     res.status(400)
   }
  
}