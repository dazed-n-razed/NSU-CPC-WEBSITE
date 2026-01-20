require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Corporate = require("./models/corporateModel");
const User = require("./models/userModel");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const workEmail = process.argv[2] || "corporate@example.com";
    const password = process.argv[3] || "ChangeMeNow!";
    const companyName = process.argv[4] || "Example Company";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure Corporate record
    const corporate = await Corporate.findOneAndUpdate(
      { workEmail },
      {
        workEmail,
        password: hashedPassword,
        companyName,
        isActive: true,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Ensure User record
    await User.findOneAndUpdate(
      { email: workEmail },
      { email: workEmail, type: "corporate", status: "active" },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log("Corporate ensured:", corporate.workEmail, "Company:", companyName);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();