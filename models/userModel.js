import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    contact: {
        type: Number,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;


//admin seed
// {
//   "email": "admin@example.com",
//   "password": "Admin@123"
// }