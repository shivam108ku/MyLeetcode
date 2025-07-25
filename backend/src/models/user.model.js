const mongoose = require('mongoose')
const { Schema } = mongoose;

 

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    profile_img: {
        type: String
    },


    emailId: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem',

        }],
        default: []
    },
    progressGraph: [
        {
            day: String, // or use Date and format it in controller
            score: Number,
        },
    ],

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, {
    timestamps: true
});


const User = mongoose.model("user", userSchema);
module.exports = User;
