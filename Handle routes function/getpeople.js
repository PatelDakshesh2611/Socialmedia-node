const { json } = require('body-parser')
const usermodel=require('../models/user')

exports.getpeople=async(req,res)=>{
try{
    const id=req.params.id
    const people=await usermodel.find({},{name:1,avatar:1}).lean()
    const peoplefollowdetails=await usermodel.findOne({_id:id},{partialfollowers:1,partialfollowing:1,followers:1,following:1})
    const datatosend=people.filter((u)=>{
        return JSON.stringify(u._id)!=JSON.stringify(id)
    })
    const following=peoplefollowdetails.following
    const partialfollowers=peoplefollowdetails.partialfollowers
    const followers=peoplefollowdetails.followers
    const partialfollowing=peoplefollowdetails.partialfollowing
    const followstatuschecker=(id)=>{
        var status='allowfollow'
        following.map((u)=>{
            if(JSON.stringify(u)==JSON.stringify(id)){
                status='followed'
            }
        })
        partialfollowing.map((u)=>{
            if(JSON.stringify(u)==JSON.stringify(id)){
                status='requestedbyyou'
            }
        })
        followers.map((u)=>{
            if(JSON.stringify(u)==JSON.stringify(id)){
                status='followed'
            }
        })
        partialfollowers.map((u)=>{
            if(JSON.stringify(u)==JSON.stringify(id)){
                status='requestedbyfriend'
            }
        })
        return status
    }
    const finalresponse=datatosend.map((u)=>{
        const status=followstatuschecker(u._id)
        return {...u,status:status}
    })

    res.status(200).json({people:finalresponse})
}
catch(e){
   res.status(400)
}
}