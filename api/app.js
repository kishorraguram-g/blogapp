const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS Configuration (Allow local & deployed frontend)
const corsOptions = {
    origin: ["http://localhost:3000", "https://blogapp-smoky-sigma.vercel.app"],  
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies & authentication headers
};

// Apply CORS Middleware (Only Once)
app.use(cors(corsOptions));

// Explicitly handle Preflight Requests
app.options("*", cors(corsOptions));

app.use(express.json());

// Debugging Middleware (Logs Incoming Requests)
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.headers.origin}`);
    next();
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Use Routes
app.use("/api", authRoutes); // Better structure, all routes under `/api`
app.use("/api", postRoutes);

// Export App
module.exports = app;
