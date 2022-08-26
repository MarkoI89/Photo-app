const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');

const password = '13456'
const hashedPassword = bcrypt.hashSync(password, 10)
mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MONGO CONNECTION USER SEEDS');
    })
    .catch((err) => {
        console.log(err)
    });

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