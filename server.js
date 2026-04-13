import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
import mongoose from "mongoose";

connectToDB();

mongoose.connection.on("disconnected", () => {
  console.warn(" MongoDB disconnected");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
