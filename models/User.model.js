const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
// Allow to have few role
const userSchema = new Schema({
  firstName: {
    type: Schema.Types.String,
    unique: true,
  },
  lastName: {
    type: Schema.Types.String,
    unique: true,
  },
  username: {
    type: Schema.Types.String,
    unique: true,
  },
  avatar: {
    type: Schema.Types.String,
    default:
      "https://res.cloudinary.com/dsbzjyxgt/image/upload/v1698514967/Photo_app_storage/blank-profile-picture-973460_640_e5copi.png",
  },
  cover: {
    type: Schema.Types.String,
    default:
      "https://res.cloudinary.com/dsbzjyxgt/image/upload/v1699215518/Photo_app_storage/bc-cover-banner-default_oahet1.jpg",
  },
  about: {
    type: Schema.Types.String,
  },
  role: [
    {
      type: Schema.Types.String,
      enum: ["photographer", "model", "makeup artist"],
      required: true,
    },
  ],
  password: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
  location: {
    type: Schema.Types.String,
  },
  friends: {
    type: Array,
    default: [],
  },
});

const User = model("User", userSchema);

module.exports = User;
