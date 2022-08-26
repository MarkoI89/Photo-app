const mongoose = require('mongoose');
const Image = require('../models/User.model.js');



// insert image data here

const seedDB = async () => {

    const allImage = await Image.insertMany(seedImage);
    console.log(allImage);
};
seedDB()