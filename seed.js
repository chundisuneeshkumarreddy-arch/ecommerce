import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
dotenv.config();

const boot = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const [email, password] = ["admin@example.com", "Admin@123"];
  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({ username: "admin", email, contact: 9999999999, password: await bcrypt.hash(password, 10), location: "India", role: "admin" });
    console.log("Admin created:", email, "/", password);
  } else {
    console.log("Admin already exists:", email);
  }
  await mongoose.disconnect();
};

boot().catch((e) => { console.log(e.message); process.exit(1); });
