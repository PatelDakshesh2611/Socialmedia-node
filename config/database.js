const mongoose=require('mongoose')

exports.connectdatabase=()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('connected')
    }).catch(console.log('error occured while connecting'))
}