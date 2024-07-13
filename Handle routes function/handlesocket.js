const user = require("../models/user");
const Message = require('../models/message')
let usersMap = {};
const socketLogic = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.id;

        const fetchUserList = async () => {
            try {
                const users = await user.find({ _id: { $ne: userId } });
                const user_details=await user.findOne({_id:userId}).select('following followers')
                const following=user_details.following
                const follwers=user_details.followers              
                const populatedUsers = await Promise.all(users.map(async (user) => {
                    const messages = await Message.find({
                        $or: [
                            { sender: user._id, receiver: userId },
                            { sender: userId, receiver: user._id }
                        ]
                    }).sort({ timestamp: 1 })

                    return {
                        _id: user._id,
                        name: user.name,
                        messages: messages,
                        img_url:user.avatar.url
                    };
                }));
                const senData=populatedUsers.filter((u)=>{
                    if(following.includes(u._id) || follwers.includes(u._id)){
                        return u
                    }
                })
                return senData;
            } catch (error) {
                console.error('Error fetching user list:', error.message);
                throw error; // Propagate the error
            }
        };

        const sendUserList = () => {
            fetchUserList()
                .then(users => {
                    socket.emit('userList', users);
                })
                .catch(error => {
                    console.error('Error fetching user list:', error);
                });
        };

        sendUserList();

        socket.on('setUserId', (userId) => {
            usersMap[userId] = socket.id;
        });

        socket.on('sendmessage', async ({ receiver, message, sender }) => {
            const recipientSocketId = usersMap[receiver];
            const senderId = usersMap[sender]
            const newMessage = new Message({
                sender,
                receiver,
                message,
                timestamp: new Date().toISOString(),
            });

            if (recipientSocketId) {
                try {
                    const savedMessage = await newMessage.save();
                    io.to(recipientSocketId).emit('messagereceived', {
                        savedMessage
                    });
                    if (senderId) {
                        io.to(senderId).emit('mymessage', {
                            savedMessage
                        })
                    }
                }
                catch (e) {
                    console.log(e)
                }

            } else {
                try{
                    const savedMessage = await newMessage.save();
                if(senderId){
                    io.to(senderId).emit('mymessage',{
                        savedMessage
                      })
                  }
            
                }catch(e){
                    console.log(e)
                }
            }
        })
        socket.on('disconnect', () => {

        });

    });
};

module.exports = socketLogic;
