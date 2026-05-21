import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ✅ FIX: Render PORT
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// LOGIN DETAILS (basic demo)
const USERNAME = "admin";
const PASSWORD = "12345";

// LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// SEND MAIL API
app.post("/send", async (req, res) => {
  const {
    firstName,
    sentFrom,
    appPassword,
    subject,
    body,
    mails
  } = req.body;

  try {
    // ✅ FIXED SMTP CONFIG (Render safe)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: sentFrom,
        pass: appPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailList = mails
      .split("\n")
      .map(email => email.trim())
      .filter(email => email);

    for (const email of emailList) {
      const info = await transporter.sendMail({
        from: `${firstName} <${sentFrom}>`,
        to: email,
        subject,
        html: body
      });

      console.log(`✅ Sent to: ${email} | ID: ${info.messageId}`);
    }

    res.json({
      success: true,
      message: "Emails Sent Successfully"
    });

  } catch (error) {
    console.log("❌ ERROR:", error);

    res.json({
      success: false,
      message: error.message
    });
  }
});

// START SERVER
app.listen(PORT, () => {
app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});