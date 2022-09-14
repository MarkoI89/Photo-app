const {
  Schema,
  model
} = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
// edit: copy role
const userSchema = new Schema({
  username: {
    type: Schema.Types.String,
    unique: true
  },
  role: {
    type: Schema.Types.String,
    enum: ["photographer", "model", "makeup artist"],
    required: true
  },
  role2: {
    type: Schema.Types.String,
    enum: ["photographer", "model", "makeup artist"],
  },
  role3: {
    type: Schema.Types.String,
    enum: ["photographer", "model", "makeup artist"],
  },
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