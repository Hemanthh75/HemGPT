import express from 'express';
import ImageKit from 'imagekit';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Chat from './models/chat.js';
import UserChats from './models/userChats.js';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
}));

app.use(express.json())

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Database Connection
const connect = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to DB')
    }catch(err){
        console.log(err)
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post("/api/chats", async(req, res) => {
    const {userId, text} = req.body;

    try{

        //Creating a new chat
        const newChat = new Chat({
            userId: userId,
            history: [{role: "user", parts:[{text}]}]
        });

       
        

        const savedChat = await newChat.save();
        
        //check if the user chat exists
        const userChats = await UserChats.find({
            userId: userId
        });

        

        if(!userChats.length){
            const newUserChats = new UserChats({
                userId: userId,
                chats:[{
                    _id: savedChat._id,
                    title: text.substring(0, 40)
                }]
            });

            await newUserChats.save()
        }else{

            await UserChats.updateOne({userId: userId}, {
                $push:{
                    chats:{
                        _id: savedChat._id,
                        title: text.substring(0, 40)
                    }
                }
            });

            res.status(201).send(newChat._id)
        }


    }catch(err){
        console.log(err);
        res.status(500).send("Error while creating chat")
    }
})

app.listen(port, () => {
    connect();
    console.log(`Server is running on ${port}`);
});
