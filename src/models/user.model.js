import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already taken"],
      required: [true, "Username is required"],
      trim: true,
    },

    email: {
      type: String,
      unique: [true, "Account already exists with this email address"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, //  don't return password by default
    },
  },
  {
    timestamps: true, //  adds createdAt & updatedAt
  },
);



const userModel = mongoose.model("User", userSchema);

export default userModel;
