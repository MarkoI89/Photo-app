//Create a server
const express = require("express");
const app = express();
const jsonWebToken = require('jsonwebtoken');
const User = require("../models/User.model");




//This middleware will check if the user is a photographer
const photographerCheck = async (req, res, next) => {
    //get the role of the user, send its as an object, we can access it from the req.body
    const user = await User.findOne({
        username: req.user.username
    });
    const role = user?.role;
    //check if the role different than photographer, decline 
    if (role !== "photographer") {
        //send a json with an error
        return res.status(401).json({
            message: 'You need to be a photographer to access'
        })
    } else {
        res.json({
            message: "you are allowed to upload pictures"
        })
        next()

    }
};




// jwt middleware

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






//apply the middleware to request
// app.post("/", photographerCheck, (req, res) => {
//     res.send("you logged in")
// })

//the app listen to the port  5005
app.listen(5005, () => {
    console.log("server running")
})

module.exports = {
    isAuthenticated,
    photographerCheck
}