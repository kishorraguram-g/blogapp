const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const corsOptions = {
    origin:process.env.FRONT_END_URL,  
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
};
app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url} from ${req.headers.origin}`);
    next();
});

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");


app.use("/api", authRoutes);
app.use("/api", postRoutes);

module.exports = app;
