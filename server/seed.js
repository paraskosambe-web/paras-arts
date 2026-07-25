require("dotenv").config();
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

(async () => {
  try {
    await connectDB();
    const email = (process.env.ADMIN_EMAIL || "admin@parasarts.com").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", email);
    } else {
      await Admin.create({ email, password, name: "Studio Admin" });
      console.log("Created admin:", email, "/", password);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
