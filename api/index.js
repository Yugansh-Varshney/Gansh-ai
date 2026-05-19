import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();

app.use(cors());
app.use(express.json({ limit: "64kb" }));

const port = Number(process.env.PORT || 8787);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/leads", async (req, res) => {
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  if (!resendKey) {
    return res.status(500).json({ detail: "Server not configured (RESEND_API_KEY missing)." });
  }
  if (!toEmail) {
    return res.status(500).json({ detail: "Server not configured (TO_EMAIL missing)." });
  }

  const {
    full_name: fullName,
    business_name: businessName,
    email,
    phone,
    need,
  } = req.body || {};

  if (!fullName || !businessName || !email || !phone || !need) {
    return res.status(400).json({ detail: "Missing required fields." });
  }

  try {
    const resend = new Resend(resendKey);
    const subject = `New lead: ${businessName} (${fullName})`;

    const text = [
      "New lead submission",
      "",
      `Full name: ${fullName}`,
      `Business name: ${businessName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Need: ${need}`,
      "",
      `Received: ${new Date().toISOString()}`,
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      replyTo: email,
    });

    return res.json({ ok: true });
  } catch (err) {
    const detail =
      err?.message || "Failed to send email.";
    return res.status(500).json({ detail });
  }
});

// Only start the Express listener during local development
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://127.0.0.1:${port}`);
  });
}

// Export the Express app for Vercel Serverless environment
export default app;
