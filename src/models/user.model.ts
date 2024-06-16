import mongoose from "mongoose";
import User from "../interfaces/user.interface";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<User>("User", userSchema);
export default User;
