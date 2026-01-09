/// step:4

import User from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

/// step:4.2
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

const TOKEN_EXPIRES = "24h";

const createToken = (userID) =>
  jwt.sign({ id: userID }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

/// step:4.1
//REGISTER FUNCTION

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be atleast 8 characters",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "server error" });
  }
}

// LOGIN FUNCTION
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "server error" });
  }
}

// GET CURRENT USER
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "server error" });
  }
}

// UPDATE USER PROFILE
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email already in use by another account.",
    });
  }


  try{

    const exists = await User.findOne({email, _id:{$ne:req.user.id}})

    if(exists){
        return res.status(409).json({success:false,message:"Email already in use by another account"})
    }

  // Update a user's name and email based on their ID
  // Using Mongoose model 'User'
  const user = await User.findByIdAndUpdate(
    req.user.id, // ID of the user to update (from authenticated request)
    { name, email }, //Object containing fields to update (name and email)
    {
      new: true,      //Return the updated document instead of the old one
      runValidators: true,     //  Ensure schema validations (like required, unique, email format) run on update
      select: "name email",    //Only return these fields, exclude others like password
    }
  );

  res.json({ success: true, user });
}
catch(err){
     console.log(err);
    res.status(500).json({ success: false, message: "server error" });
}}



// CHANGE PASSWORD FUNCTION
export async function updatePassword(req,res){
    const {currentPassword , newPassword} = req.body
    if(!currentPassword || !newPassword || newPassword.length < 8){
        return res.json(400).json({success:false ,message:"Password invalid or too short"})
    }

    try {

        const user = await User.findById(req.user.id).select("password")

        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }

        const match = await bcrypt.compare(currentPassword, user.password)

        if(!match){
            return res.status(401).json({success:false, message:"Current password incorrect"})
        }
        
        user.password = await bcrypt.hash(newPassword,10)
        await user.save()
        res.json({success:true , message:"Password changed"})
    } catch (err) {
         console.log(err);
    res.status(500).json({ success: false, message: "server error" });
    }
}