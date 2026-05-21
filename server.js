import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000; // Render safe fallback

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: prevent timeout / slow parsing issues
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// HEALTH CHECK (IMPORTANT for Render stability)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// LOGIN
const USERNAME = "admin";
const PASSWORD = "12345";

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === USERNAME && password === PASSWORD) {
      return res.json({ success: true });
    }

    return res.json({ success: false });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// SEND MAIL (FIXED + TIMEOUT SAFE)
app.post("/send", async (req, res) => {
  try {
    const { firstName, sentFrom, subject, body, mails } = req.body;

    if (!mails || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailList = mails
      .split("\n")
      .map(e => e.trim())
      .filter(Boolean);

    // send sequentially (avoids Render timeout crash)
    for (let i = 0; i < emailList.length; i++) {
      const email = emailList[i];

      await transporter.sendMail({
        from: `${firstName} <${sentFrom}>`,
        to: email,
        subject,
        html: body
      });

      console.log(`Sent (${i + 1}/${emailList.length}):`, email);
    }

    return res.json({
      success: true,
      message: `Emails sent: ${emailList.length}`
    });

  } catch (err) {
    console.log("ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// IMPORTANT FOR RENDER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});