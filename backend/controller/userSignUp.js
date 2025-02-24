const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try{
        const {email, password, name} = req.body

        const user = await userModel.findOne({email})
        console.log("user",user)

        if(user){
            throw new Error("Already User Exist..")
        }

        if(!email){
            throw new Error("Please Provide the email")
        }
        if(!password){
            throw new Error("Please Provide the password")
        }
        if(!name){
            throw new Error("Please Provide the name")
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        if(!hashPassword){
            throw new Error("Something went wrong")
        }

        const payload = {
            ...req.body,
            role : "GENERAL",
            password : hashPassword
        }

        const userData = new userModel(req.body)
        const saveUser = await userData.save()

        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "User Created Successfully"
        })

    }catch(err){
        res.json({
            message : err.message || err ,
            error : true,
            success : false,
        })
    }
}

module.exports = userSignUpController