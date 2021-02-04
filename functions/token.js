const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../config/constants');

async function create(payload){
    try {
        let token = await jwt.sign(payload, JWT_SECRET, {
            expiresIn: '30d'
        });
        return token;
    }
    catch(e){
        console.log(e);
        return "error";
    }
}

async function verify(token){
    try {
        let res = await jwt.verify(token, JWT_SECRET);
        return res;
    } catch (e) {
        return "error"
    }
}

module.exports = {
    create,
    verify
}
