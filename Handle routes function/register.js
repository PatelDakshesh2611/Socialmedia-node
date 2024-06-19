const usermodel=require('../models/user')

exports.register=async(req,res)=>{
   try{
      const registerinfo=req.body
      const checkemailindb=await usermodel.findOne({email:registerinfo.email})
      if(checkemailindb){
         res.status(200).json({message:'loggeinuser'})
      }
      else{
      const databaseres=await usermodel.create(registerinfo)
      res.status(200).json({message:'ok',data:databaseres})
      }
   }catch(error){
      res.sendStatus(401)
   }
}