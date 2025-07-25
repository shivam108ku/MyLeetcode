const jwt = require('jsonwebtoken')

const generateTokenAndSetCookie = (res,userId,role)=>{
    const token = jwt.sign({userId , role}, process.env.JWT_SECRET,{
        expiresIn: '7d',
    })

    res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token;
}

module.exports = generateTokenAndSetCookie;
