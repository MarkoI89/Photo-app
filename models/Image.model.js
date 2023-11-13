const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  link: Schema.Types.String,
  description: Schema.Types.String,
  likes: {
    type: Map,
    default: [],
  },
  photographer: {
    type: Schema.Types.String,
    ref: "User",
  },
  model: {
    type: Schema.Types.String,
    ref: "User",
  },
  makeup_artist: {
    type: Schema.Types.String,
    ref: "User",
  },
});

const Image = model("Image", imageSchema);

module.exports = Image;
