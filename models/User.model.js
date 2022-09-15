const {
  Schema,
  model
} = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
// Allow to have few role
const userSchema = new Schema({
  username: {
    type: Schema.Types.String,
    unique: true
  },
  Profile_photo: {
    type: Schema.Types.String,
  },
  about: {
    type: Schema.Types.String,
  },
  role: [{
    type: Schema.Types.String,
    enum: ["photographer", "model", "makeup artist", "hair designer", "art director", "producer", "props master"],
    required: true
  }],
  password: {
    type: Schema.Types.String,
    required: true
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
});

const User = model("User", userSchema);

module.exports = User;