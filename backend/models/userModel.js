/// step:3

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})


// Mongoose ek hi naam ka model sirf ek baar banane deta hai
// File dobara load hui (nodemon / hot-reload / multiple imports)
// Model phir se banne ki koshish karega
// ❌ Error aayega:
    // OverwriteModelError: Cannot overwrite `User` model once compiled

// first time run: 
    //mongoose.models.user   // undefined
    //new model create hota hai:
        // mongoose.model("user", userSchema);

 //second time run       
   // mongoose.models.user   // already exists


const userModel = mongoose.models.user || mongoose.model("user",userSchema)

export default userModel