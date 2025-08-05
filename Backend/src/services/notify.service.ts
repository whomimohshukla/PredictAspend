import nodemailer from "nodemailer";
import twilio from "twilio";

/*
 * Centralised notification helper for PredictaSpend.
 * Provides sendEmailOTP() and sendSmsOTP() with user-friendly copy.
 */

const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const twilioClient = twilio(
  process.env.TWILIO_SID as string,
  process.env.TWILIO_TOKEN as string
);

const APP_NAME = "PredictaSpend";

// ------------------------ Email ------------------------
export const sendEmail = async (to: string, code: string) => {
  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#0d6efd">${APP_NAME} Verification</h2>
    <p>Hello!</p>
    <p>Use the verification code below to sign in to your ${APP_NAME} account. The code expires in <strong>5 minutes</strong>.</p>
    <div style="font-size:32px;font-weight:bold;letter-spacing:6px;text-align:center;margin:24px 0">${code}</div>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p style="margin-top:40px">— The ${APP_NAME} Team</p>
  </div>`;

  await smtpTransport.sendMail({
    from: `${APP_NAME} <no-reply@predictaspend.com>`,
    to,
    subject: `${APP_NAME} Login Code: ${code}`,
    html,
  });
};

// ------------------------ SMS -------------------------
export const sendSms = async (to: string, code: string) => {
  const body = `Your ${APP_NAME} login code is ${code}. It expires in 5 minutes.`;
  await twilioClient.messages.create({
    to,
    from: process.env.TWILIO_FROM as string,
    body,
  });
};
