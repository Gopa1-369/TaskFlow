/// step:1


import express from "express"
import { connectDB } from "./config/db.js"
import cors from 'cors'
import 'dotenv/config'
import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"
import dotenv from "dotenv";
dotenv.config();



const app = express()
const port = process.env.PORT


//MIDDLEWARE
app.use(cors())
app.use(express.json())
// express.urlencoded() HTML form se aane wale x-www-form-urlencoded data ko req.body me convert karta hai.
    // Browser form data ko aise bhejta hai:  
        // email=user@gmail.com&password=123456
    // express.urlencoded() ise parse karke:
        // { email: 'user@gmail.com', password: '123456' }
app.use(express.urlencoded({extended:true}))

// DB CONNECT
connectDB()

//Routes
app.use('/api/user',userRouter)
app.use('/api/tasks',taskRouter)   ///step:10


app.get("/",(req,res)=>{
    res.send('API Working')
})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})