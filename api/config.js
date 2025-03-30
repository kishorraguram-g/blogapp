require("dotenv").config(); // Load environment variables from config.env

module.exports = {
  port: process.env.PORT || 4000,
  mongoURL: process.env.MONGO_URI || "",
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || "",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
};
