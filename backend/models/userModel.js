const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true }, // ✅ Added required validation
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: { type: String, required: true }, // ✅ Ensured password is required
    profilePic: { type: String, default: "" }, // ✅ Set default value for profilePic
    role : {type: String},
}, {     
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;