const mongoose = require('mongoose');
const Image = require('../models/Image.model.js');
const {
    findOneAndUpdate
} = require('../models/User.model');
const User = require('../models/User.model')
require('./../db')

// insert image data here

// add link key in each seeImage

const seedImage = [{
        shot_by: '',
        model: '',
        makeup_artist: '',

    },
    {
        shot_by: '',
        model: '',
        makeup_artist: '',

    },


]


const seedDB = async () => {
    await Image.deleteMany()
    const allPhotographers = await User.find({
        role: 'photographer'
    })
    let findUser = await User.find()
    console.log(findUser)
    console.log(allPhotographers)
    const allModels = await User.find({
        role: 'model'
    })
    console.log(allModels)
    const allMakeupArtist = await User.find({
        role: 'makeup artist'
    })
    console.log(allMakeupArtist)
    seedImage.forEach(picture => {
        picture.shot_by = randomIdFrom(allPhotographers)
        picture.model = randomIdFrom(allModels)
        picture.makeup_artist = randomIdFrom(allMakeupArtist)
    })

    const allImage = await Image.create(seedImage);
    console.log(allImage);
};
seedDB()

function randomIdFrom(array) {
    return array[Math.floor(Math.random() * array.length)]?._id

}