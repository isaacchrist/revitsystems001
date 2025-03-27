import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Enable CORS for specific origins (use for production)
// app.use(cors({
//   origin: "https://zimic-propertise.onrender.com",  // Update this with your frontend URL
//   methods: ['GET', 'POST'],
// }));

app.use(express.json());

// Email sending function
const sendEmail = async (name, email, phone, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Receiving the email at your Gmail
      subject: `New Message from ${name} - ${subject}`,
      text: `You have received a new message from your website contact form:\n\n
      Name: ${name}\n
      Email: ${email}\n
      Phone: ${phone}\n
      Subject: ${subject}\n
      Message: ${message}\n\n
      Reply to: ${email}`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
};

// API route to handle email sending
app.post("/send-email", async (req, res) => {
  // Your email handling logic here...
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const result = await sendEmail(name, email, phone, subject, message);
  res.json(result);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
