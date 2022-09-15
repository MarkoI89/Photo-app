//Create a server
const jsonWebToken = require('jsonwebtoken');
const User = require("../models/User.model");





const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(400).json({
                message: 'No token found!'
            })
        }
        token = token.replace('Bearer ', '')
        const userToken = jsonWebToken.verify(token, process.env.TOKEN_SECRET)
        console.log(userToken)
        const user = await User.findOne({
            username: userToken.username
        })
        if (!user) {
            return res.status(400).json({
                message: 'Invalid token'
            })
        }
        req.user = user
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
    // Once everything went well, go to the next middleware
    next()
}



//This middleware will check if the user is a photographer
const photographerCheck = async (req, res, next) => {
    await isAuthenticated(req, res, next)
    return (req, res, next) => {

    const role = req.user.role
   
    //check if the role different than photographer, decline 
    
    if (role.includes("photographer")) {
        //send a json with an error
        return next()
    } else {
        return res.status(401).json({
            message: 'You need to be a photographer to access'
        })
        

    }
};


}

// jwt middleware







module.exports = {
    isAuthenticated,
    photographerCheck,
}