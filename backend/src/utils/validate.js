const validator = require('validator');

const validate = (data) => {
    if (!data.emailId || !validator.isEmail(data.emailId)) {
        throw new Error('Invalid Email');
    }
    if (!data.password || !validator.isStrongPassword(data.password)) {
        throw new Error('Weak password');
    }
};

module.exports = validate;
