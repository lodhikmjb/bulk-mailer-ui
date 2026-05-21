import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Health check (Render important)
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

// SEND MAIL (SENDGRID API - FIXED)
app.post("/send", async (req, res) => {
  try {
    const { firstName, sentFrom, subject, body, mails } = req.body;

    if (!mails || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const emailList = mails
      .split("\n")
      .map(e => e.trim())
      .filter(Boolean);

    for (const email of emailList) {
      await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email }]
            }
          ],
          from: {
            email: "lodhikmjb@gmail.com",
            name: "Bulk Mailer"
          },
          subject: subject,
          content: [
            {
              type: "text/html",
              value: body
            }
          ]
        })
      });

      console.log("Sent:", email);
    }

    res.json({
      success: true,
      message: `Emails sent: ${emailList.length}`
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Start server (Render safe)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});