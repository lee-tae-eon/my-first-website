import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialLogin: { type: Boolean, default: false },
  username: { type: String, required: true },
  password: {
    type: String,
    required: function () {
      return !this.socialLogin;
    },
  },
  name: { type: String, required: true },
  location: String,
  joinDate: { type: Date, default: Date.now(), requried: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

// hashing password with middleware
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
