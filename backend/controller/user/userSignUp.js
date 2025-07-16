const userModel = require('../../models/userModel');
const bcrypt = require("bcryptjs");

async function userSignUpController(req, res) {
    try {
        const { email, password, name, profilePic } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                error: true,
                success: false,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        if (!hashPassword) {
            throw new Error("Error hashing password");
        }

        const userData = new userModel({
            email,
            password: hashPassword,
            name,
            profilePic: profilePic || "",
            role: "GENERAL",
        });

        const saveUser = await userData.save();

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User Created Successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
