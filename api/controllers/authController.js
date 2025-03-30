const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// Register User
const registerUser = async (req, res) => {
  console.log("🔹 Received request:", req.body);

  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ error: "⚠️ Account already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log("✅ User registered successfully!");
    res.status(201).json({ message: "✅ Registration successful" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "❌ Registration failed" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "⚠️ User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "⚠️ Invalid credentials" });

    res.json({ message: "✅ Login successful", user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "❌ Login failed" });
  }
};

module.exports = { registerUser, loginUser };
