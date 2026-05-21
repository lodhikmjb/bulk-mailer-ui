import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// LOGIN
const USERNAME = "admin";
const PASSWORD = "12345";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// SEND MAIL
app.post("/send", async (req, res) => {
  const { firstName, sentFrom, subject, body, mails } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
      }
    });

    const emailList = mails
      .split("\n")
      .map(e => e.trim())
      .filter(Boolean);

    for (const email of emailList) {
      await transporter.sendMail({
        from: `${firstName} <${sentFrom}>`,
        to: email,
        subject,
        html: body
      });

      console.log("Sent to:", email);
    }

    res.json({ success: true, message: "Emails sent" });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});