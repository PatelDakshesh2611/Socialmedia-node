const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({ 
    cloud_name: 'dhve4zn7l', 
    api_key: '858161821583917', 
    api_secret: 'NRezyaBvqsRlevixGsr2eOMcZ78' 
  });

  const localUploadsDirectory = 'uploads';

// Create the directory if it doesn't exist


exports.createpost=async(req,res)=>{
 
}