//importing libraries
const express=require('express')
const { default: mongoose, mongo } = require('mongoose')
const multer=require('multer')
const path=require('path')
const cors=require('cors')
const register=require('./Handle routes function/register')
const login=require('./Handle routes function/login')
const getfollowers=require('./Handle routes function/getfollowers')
const bodyParser = require('body-parser')
const postmodel=require('./models/post')
const getmypost=require('./Handle routes function/getmypost')
const followandunfollow=require('./Handle routes function/followrequest')
const acceptorreject=require('./Handle routes function/acceptreject')
const getpeople=require('./Handle routes function/getpeople')
const getnotification=require('./Handle routes function/getnotification')
const docommments=require('./Handle routes function/docomments')
const handlelikes=require('./Handle routes function/handlelikes')
const usermodel=require('./models/user')
const deletepermanently=require("./Handle routes function/deleteaccountper").default
const getpost=require('./Handle routes function/getpost')
const deletecomment=require('./Handle routes function/deletecomments').default
const socketLogic=require('./Handle routes function/handlesocket')
const cloudinary = require('cloudinary').v2;
const socketIo=require('socket.io')
const {
  createServer
}=require('http')
const {Server}=require('socket.io')
const fs = require('fs');
//code start from here

const app = express();
app.use(bodyParser.json())
app.use(cors())
const server = createServer(app); // Create an HTTP server
const io =new Server(server,{
  cors:{
    origin:'*'
  }
}); // Attach Socket.IO to the server
require('dotenv').config()

//mongodb connection

mongoose.connect(process.env.MONGO_URL).then(console.log('connected')).catch((error)=>{
console.log(error)
})
//defining multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//defining routes
app.post('/register',(req,res)=>{
 register.register(req,res)
})
app.post('/login',(req,res)=>{
    login.login(req,res)
})
//cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });
 
  const localUploadsDirectory = 'uploads';
  if (!fs.existsSync(localUploadsDirectory)) {
    fs.mkdirSync(localUploadsDirectory);
  }
//create post
let localFilenamee=''
app.post('/createpost',upload.single('image'),async(req,res)=>{
    try {
        const localFilename = `${localUploadsDirectory}/${Date.now()}_${req.file.originalname}`;
        localFilenamee=localFilename
        fs.writeFileSync(localFilename, req.file.buffer);
        const cloudinaryResult = await cloudinary.uploader.upload(localFilename,{
            folder:'Posts'
        });
        const postdata={
            owner:req.body.owner,
            caption:req.body.desc,
            image:{
                public_id:cloudinaryResult.public_id,
                url:cloudinaryResult.secure_url
            }
        }
        const dbres=await postmodel.create(postdata)
        const dbrestoaddtouser=await usermodel.updateOne({_id:postdata.owner},{$push:{post:dbres._id}})
        res.status(200).json({ message: 'Image uploaded successfully' });
        fs.unlink(localFilename, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } 
          });
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Internal server error' });
        fs.unlink(localFilenamee, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } 
          });
      }

})        
//sending posts to frontend to show
app.get('/getpost/:id',(req,res)=>{
   getpost.getpost(req,res)
   
})
//Do comments api
app.post('/docommments',(req,res)=>{
    docommments.docomments(req,res)
})
//For adding profile image
const localdirectory='Profile'
let localFilenamees=''
if(!fs.existsSync(localdirectory)){
  fs.mkdirSync(localdirectory)
}

app.get('/',(req,res)=>{
  res.json({
    message:'Its Working Now'
  })
})
app.post('/saveprofileimage',upload.single('image'),async(req,res)=>{
 try{
  const localFilename = `${localdirectory}/${Date.now()}_${req.file.originalname}`
  localFilenamees=localFilename
  fs.writeFileSync(localFilename,req.file.buffer)
  const cloudinaryResult = await cloudinary.uploader.upload(localFilename,{
    folder:'Profileimages'
});

const resfrommongoose=await usermodel.findOneAndUpdate({_id:req.body.id},{avatar:{public_id:cloudinaryResult.public_id,url:cloudinaryResult.secure_url}},{new:true})
fs.unlink(localFilename, (err) => {
  if (err) {
    console.error('Error deleting file:', err);
  }
});
  res.status(200).json({avatar:resfrommongoose.avatar})
 }
 catch(e){
  fs.unlink(localFilenamees, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } 
  });
   res.sendStatus(400) 
 }
})
//api to handle likes and unlikes
app.post('/handlelikes',(req,res)=>{
   handlelikes.handlelikes(req,res)
})
//api to send users own post.
app.get('/getmypost/:id',(req,res)=>{
   getmypost.getmypost(req,res)
})
//get people to follow and unfollow
app.get('/getpeople/:id',(req,res)=>{
  getpeople.getpeople(req,res)
})
//follow request
app.post('/followandunfollow',(req,res)=>{
   followandunfollow.followandunfollow(req,res)
})
//for getting all notificaitions
app.get('/getnotifications/:id',(req,res)=>{
   getnotification.getnotification(req,res)
})
//accept reject
app.post('/acceptorreject',(req,res)=>{
   acceptorreject.acceptreject(req,res)
})
//for getting followers and following to show
app.get('/getfollowers/:id',(req,res)=>{
   getfollowers.getfollowers(req,res) 
})
// for deleting comments
app.post('/deletecomment',(req,res)=>{
   deletecomment(req,res)
})

app.post('/deleteaccount',(req,res)=>{
    deletepermanently(req,res)
})

socketLogic(io);
const PORT=process.env.PORT
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

})


