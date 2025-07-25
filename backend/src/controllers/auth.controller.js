const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie')
const validate = require('../utils/validate')
const { sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail } = require('../mailtrap/emails')
const redisClient = require('../databases/redis')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const Submission = require('../models/submmision.model')

const register = async (req, res) => {

    try {
        validate(req.body)

        const { emailId, password, firstName } = req.body;
        req.body.role = 'user'

        if (!emailId || !password || !firstName)
            throw new Error("All fields are required");

        const userAlreadyExists = await User.findOne({ emailId });
        if (userAlreadyExists) {
            return res.status(400).json({ sucess: false, message: "User Already Exists" })
        }

        // Hashing the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            emailId, password: hashedPassword,
            firstName,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        await user.save();

        await sendVerificationEmail(user.emailId, verificationToken)

        // JWT Token
        generateTokenAndSetCookie(res, user._id, 'user')
        res.status(201).json({
            sucess: true,
            message: "Created Sucessfully",
            user: { ...user._doc, password: undefined }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })

    }
}

const verifyEmail = async (req, res) => {
    // Get the code
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expire verification code" })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.emailId, user.firstName)

        res.status(200).json({
            success: true, message: "Email verified Sucessfully",

            user: {
                ...user._doc,
                password: undefined
            }
        },

        )

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

const login = async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({
                success: false, message: "Invalid credentials"
            })
        }

        // comparing the password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false, message: "Invalid credentials"
            })
        }

        generateTokenAndSetCookie(res, user._id, user.role);
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            sucess: true,
            message: "Logged in Sucessfully",
            user: { ...user._doc, password: undefined }
        })

    } catch (error) {
        console.log("Error in login", error)
        return res.status(400).json({
            success: false, message: error.message
        })
    }

}

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) return res.status(400).send("Token not found");

        const payload = jwt.decode(token);
        if (!payload || !payload.exp) return res.status(400).send("Invalid token payload");

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).send("Logged out Successfully");
    } catch (error) {
        console.log("Logout Error:", error.message);
        res.status(400).send("error: " + error.message);
    }
};

const forgotPassword = async (req, res) => {
    const { emailId } = req.body;

    try {
        if (!emailId) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate reset token and expiry time
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendPasswordResetEmail(user.emailId, resetURL);

        return res.status(200).json({
            success: true,
            message: "Password reset email link sent"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },

        });
        if (!user) {
            return res.status(400).json({ success: false, message: "invalid or expired reset token" });
        }

        // Update the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();


        await sendResetSuccessEmail(user.emailId);
        return res.status(200).json({ success: true, message: "Password reset Sucessfully" });

    } catch (error) {
        console.log("Error in resetPassowrd", error)
        return res.status(400).json({ success: false, message: error.message });
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const adminRegister = async (req, res) => {
    try {
        validate(req.body)

        const { emailId, password, firstName } = req.body;

        if (!emailId || !password || !firstName)
            throw new Error("All fields are required");

        const userAlreadyExists = await User.findOne({ emailId });
        if (userAlreadyExists) {
            return res.status(400).json({ sucess: false, message: "User Already Exists" })
        }

        // Hashing the password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()


        const user = new User({
            emailId, password: hashedPassword,
            firstName,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            role: 'admin'
        })

        await user.save();

        await sendVerificationEmail(user.emailId, verificationToken)

        // JWT Token
        generateTokenAndSetCookie(res, user._id, 'admin')
        res.status(201).json({
            sucess: true,
            message: "Created Sucessfully",
            user: { ...user._doc, password: undefined }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })

    }
}

const deleteProfile = async (req, res) => {
    try {

         if (!user) return res.status(404).json({ message: 'User not found' });
        const userId = req.result._id;
        User.findByIdAndDelete(userId);

        Submission.deleteMany({ userId });

        res.status(200).send("Deleted Sucessfully");

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}




module.exports = { register, adminRegister, deleteProfile, forgotPassword, checkAuth, resetPassword, login, logout, verifyEmail }