const postmodel=require('../models/post')
const usermodel=require('../models/user')
exports.getpost=async(req,res)=>{
try{
    
    const userid=req.params
    
    //below function check whether a particular post has your like or not
    const likechecker=(likesarray)=>{
      let status=false
      for(let i=0;i<likesarray.length;i++){
       if(likesarray[i]==userid.id){
        status=true
       }
      }
      return status
    }
    //like counter count the number of likes in a post
    const likecounter=(likes)=>{
      var numberoflikes=0
      likes.map((u)=>{
        numberoflikes=numberoflikes+1
      })
      return numberoflikes
    }
    const datafromdbs=await postmodel.find().lean()
    const newdata= await Promise.all(datafromdbs.reverse().map(async(u)=>{
      let newcomments=[]
      let newlikess=[]
       const userdata=await usermodel.findOne({_id:u.owner},{name:1,avatar:1}).lean()
       const user={
        name:userdata.name,
        avatar:userdata.avatar
       }
       if(u.comments.length>0){
          newcomments=await Promise.all( u.comments.map(async(u)=>{
             const dataofcomments=await usermodel.findOne({_id:u.users},{name:1,avatar:1})
            
             const finaldata={
              id:u._id,
              user:{
                image:dataofcomments.avatar.url,
                name:dataofcomments.name
              },
              content:u.comment,
              userid:u.users
             }
             return finaldata
         }))
     
       }
       var likestatus=likechecker(u.likes)
       var likescount=likecounter(u.likes)
      
       if(u.likes.length>0){
         newlikess=await Promise.all(u.likes.map(async(likess)=>{
         const userdata=await usermodel.findOne({_id:likess},{avatar:1,name:1,})
         const finaldataoflikes={
          id:likess._id,
          user:{
              image:userdata.avatar.url,
              name:userdata.name
          }}
          return finaldataoflikes
        }))
       
       }
      
       return({...u,user,comments:newcomments,likes:newlikess,likestatus:likestatus,likescount:likescount})
    }))    
    // console.log(newdata)
    // console.log(userid)
    const user = await usermodel.findById(userid.id).select('following followers');
    
    const findIsInFollowersOrFollowing=()=>{
     const new_data= newdata.filter((u)=>{               
          if(user.followers.includes(u.owner) || user.following.includes(u.owner) || u.owner==userid.id){           
             return u
          }
      })
     return new_data
    }
    const final_Material=findIsInFollowersOrFollowing()
    // console.log(user)  
    res.status(200).json({postdata:final_Material.slice((req.query.page-1)*req.query.limit,req.query.limit*req.query.page)})
}
catch(e){
  res.sendStatus(400)
console.log(e)}
}