const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
// Allow to have few role
const userSchema = new Schema({
  username: {
    type: Schema.Types.String,
    unique: true,
  },
  avatar: {
    type: Schema.Types.String,
  },
  about: {
    type: Schema.Types.String,
    maxLength: 200
  },
  role: {
    type: [{
    type: Schema.Types.String,
    enum: ["photographer", "model", "makeup artist", "hair designer", "art director", "producer", "props master"],
    required: true
  }],
  validate: [arrayLimit, '{PATH} exceeds the limit of 3']
},
  password: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
});
function arrayLimit(val) {
  return val.length <= 3;
}

const User = model("User", userSchema);

module.exports = User;
