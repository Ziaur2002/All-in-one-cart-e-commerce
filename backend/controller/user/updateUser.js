const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        const { name, mobile } = req.body;

        const payload = {
            ...(name && { name: name }),
            ...(mobile && { mobile: mobile })
        };

        const updatedUser = await userModel.findByIdAndUpdate(sessionUser, payload, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found or unable to update.",
                error: true,
                success: false
            });
        }

        res.json({
            data: updatedUser,
            message: "Profile updated successfully!",
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error in updateUser backend:", err);
        res.status(500).json({
            message: err.message || "An internal server error occurred during profile update.",
            error: true,
            success: false
        });
    }
}

module.exports = updateUser;
