/// step:2


import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://thelegendgopalnikumbh369_db_user:flowtask787@cluster0.qih0a5e.mongodb.net/TaskFlow')
    .then(()=>console.log("DB CONNECTED"))
}