import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
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
});

// hashing password with middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
