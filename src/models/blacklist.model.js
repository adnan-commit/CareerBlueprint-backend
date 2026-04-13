import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added in blacklist"],
      trim: true,
      unique: [true, "This token is already blacklisted"],
    },

  },
  {
    timestamps: true,
  }
);

//  Auto-delete expired tokens (after 1 day)
blacklistTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 } // 24 hours
);

const TokenBlacklist = mongoose.model(
  "TokenBlacklist",
  blacklistTokenSchema
);

export default TokenBlacklist;