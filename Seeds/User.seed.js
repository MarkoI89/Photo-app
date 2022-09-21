const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');
require('./../db')
const password = '13456'
const hashedPassword = bcrypt.hashSync(password, 10)

const seedUser = [{
        username: 'Marly',
        role: 'photographer',
        email: 'marly@gmail.com',
        password: hashedPassword,
    },
    {
        username: 'Marko',
        role: 'photographer',
        email: 'marko@gmail.com',
        password: hashedPassword,
    }, 
    {
        username: 'Ema',
        role: 'makeup artist',
        email: 'Ema@gmail.com',
        password: hashedPassword,
    },{
        username: 'Em',
        role: 'makeup artist',
        email: 'Em@gmail.com',
        password: hashedPassword,
    },{
        username: 'Ema',
        role: 'makeup artist',
        email: 'Ema@gmail.com',
        password: hashedPassword,
    },{
        username: 'Ema',
        role: 'makeup artist',
        email: 'Ema@gmail.com',
        password: hashedPassword,
    },{
        username: 'Ema',
        role: 'makeup artist',
        email: 'Ema@gmail.com',
        password: hashedPassword,
    },{
        username: 'Ema',
        role: 'makeup artist',
        email: 'Ema@gmail.com',
        password: hashedPassword,
    },
    {
        username: 'Mike',
        role: 'model',
        email: 'mike@gmail.com',
        password: hashedPassword,
    },
]

const seedDB = async () => {
    await User.deleteMany()
    const allUser = await User.insertMany(seedUser);
    console.log(allUser);
};
seedDB()

// seedDB().then(() => {
//     mongoose.connection.close();
// });