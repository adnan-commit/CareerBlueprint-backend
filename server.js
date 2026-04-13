import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
import mongoose from "mongoose";

connectToDB();

mongoose.connection.on("disconnected", () => {
  console.warn(" MongoDB disconnected");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("API is running...");
});