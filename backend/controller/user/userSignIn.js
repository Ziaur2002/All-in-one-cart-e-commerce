const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel'); // Corrected path
const jwt = require('jsonwebtoken')

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new Error("Please Provide the email")
        }
        if (!password) {
            throw new Error("Please Provide the password")
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        console.log("checkPassword:", checkPassword)

        if (!checkPassword) {
            return res.status(400).json({
                message: "Please check password",
                error: true,
                success: false
            })
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8hr" });

        const tokenOption = {
            httpOnly: true,
            secure: false, // Change to `true` in production (HTTPS required)
            sameSite: "Lax"
        }

        res.cookie("token", token, tokenOption).status(200).json({
            message: "Login successfully",
            data: token,
            success: true,
            error: false
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false
        })
    }
}

module.exports = userSignInController
