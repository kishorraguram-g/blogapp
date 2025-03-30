const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const corsOptions = {
    origin: "http://localhost:3000", // Change this to your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies & authentication headers
  };
  
app.use(cors(corsOptions));
const cors = require("cors");
app.use(cors({ origin: "*" })); 

app.use(express.json());


// Import routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Use routes
app.use("/", authRoutes);
app.use("/", postRoutes);



module.exports = app;
