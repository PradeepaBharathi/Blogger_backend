import express, { Router, request, response } from "express";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";

import { LoginUser, signupUser,getUser,tokenUsed, getUserByEmail } from "../controller/user_controller.js";

dotenv.config()
const url = 'http://localhost:9000';

const router = express.Router();

router.post("/add-user", async (req, res) => {
    try {

        
        const { Name, Email, Password } = req.body;
        
        
        if (!Name || !Email || !Password) {
            return res.status(400).json({message:"Please fill all details",status:false})
        }    
        
        const exisitingUser = await getUserByEmail(Email);
        if (exisitingUser) {
            return res.status(401).send({
                success: false,
                message: "user already exisits",
        });
        }


        const hashedPassword = await bcrypt.hash(Password, 10)
        console.log(hashedPassword)
        const result = await signupUser({Name,Email,Password : hashedPassword});
        console.log(result)
        if (!result.acknowledged) {
             return res.status(400).json({message:"error occured"})
        }

        res.status(200).json({data:{Name,Email,Password},status:result,message:"user added successfully"})
    } catch (error) {
          console.log(error)
        res.status(500).json({message:"server error occured",success:false,error})
        
    }
})

router.post("/add-login-user", async (req, res) => {
        const {  Email, Password } = req.body;
       
    try {
        let user = await getUserByEmail(Email)
        console.log(user)
        
        if (!user) {
            return res.status(400).json({ message: "Email does not match" })
        }
        let match = await bcrypt.compare(Password, user.Password)
        if (!match) {
            return res.status(400).json({ message: "Invalid Password" })
        }
        
        const accessToken = jwt.sign({ _id: user._id, Name: user.Name, Email: user.Email }, process.env.ACCESS_SECRET_KEY, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ _id: user._id, Name: user.Name, Email: user.Email }, process.env.REFRESH_SECRET_KEY);
        
        const newToken = await tokenUsed({ accessToken,token: refreshToken })
        console.log("newToken",newToken)
        
        return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, name: user.Name, Email: user.Email ,_id:user._id })
        
    } catch (error) {
          console.log(error)
        res.status(500).json({message:"server error occured"})
        
    }
})

router.get('/get-user', async (req, res) => {
   
    try {
        const studentData =  await getUser(req);
        // console.log(studentData)
    if(!studentData){
        return res.status(400).json({message:"no data availabe"})
    }
    res.status(200).json({data:studentData})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})

export const user_router = router;
