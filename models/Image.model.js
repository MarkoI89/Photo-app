const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  link: Schema.Types.String,
  shot_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  model: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  makeup_artist: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// connexion between models => user

const Image = model("Image", imageSchema);

module.exports = Image;
