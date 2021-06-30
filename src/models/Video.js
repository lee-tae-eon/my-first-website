import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    requried: true,
    trim: true,
    minLength: 3,
    maxLength: 80,
  },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String },
  description: { type: String, requried: true, trim: true, maxLength: 200 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

//static function(for hashtags)
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
