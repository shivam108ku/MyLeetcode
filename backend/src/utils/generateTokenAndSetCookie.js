const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,            // must be true on HTTPS
        sameSite: 'None',        // must be 'None' for cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

<<<<<<< HEAD
    res.cookie("token",token,{
        httpOnly:true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
=======
>>>>>>> ccecc6c8b4b21ad01d80939861f142ee8be85620
    return token;
};

module.exports = generateTokenAndSetCookie;
<<<<<<< HEAD


// const jwt = require('jsonwebtoken');

// const generateTokenAndSetCookie = (res, userId, role) => {
//     const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
//         expiresIn: '7d',
//     });

//     res.cookie("token", token, {
//         httpOnly: true,
//         secure: true,            // must be true on HTTPS
//         sameSite: 'None',        // must be 'None' for cross-site cookie
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return token;
// };

// module.exports = generateTokenAndSetCookie;



=======
>>>>>>> ccecc6c8b4b21ad01d80939861f142ee8be85620
