const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gkishorraguram@gmail.com", 
    pass: "pass key", 
  },
});


app.post("/send-email", async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  const mailOptions = {
    from: "kishorraguram@gmail.com", 
    to: recipientEmail,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
