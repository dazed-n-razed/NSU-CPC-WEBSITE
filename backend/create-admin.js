require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/adminModel");
const User = require("./models/userModel");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.argv[2] || "admin@example.com";
    const password = process.argv[3] || "ChangeMeNow!"; // will be hashed below

    // node create-admin.js newadmin@example.com "StrongPassword123!"
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.findOneAndUpdate(
      { email },
      { email, password: hashedPassword },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // ensure User record
    await User.findOneAndUpdate(
      { email },
      { email, type: "admin", status: "active" },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log("Admin ensured:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();