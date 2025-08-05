import nodemailer from "nodemailer";
import twilio from "twilio";
import "dotenv/config";

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
	const html = `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;background:#f5f7fa">
  <head>
    <meta charset="utf-8" />
    <title>${APP_NAME} Verification</title>
  </head>
  <body style="margin:0;padding:0;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background:#f5f7fa;padding:40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background:#ffffff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.05);overflow:hidden">
            <tr>
              <td style="background:#0d6efd;padding:24px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;letter-spacing:1px">
                ${APP_NAME}
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;color:#111111;font-size:16px;line-height:1.6">
                <p style="margin-top:0">Hello!</p>
                <p style="margin:0 0 24px 0">Use the verification code below to sign in to your <strong>${APP_NAME}</strong> account. For your security, this code will expire in <strong>5 minutes</strong>.</p>
                <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;margin:24px 0;color:#0d6efd">${code}</div>
                <p style="margin:24px 0 0 0">If you did not initiate this request, please ignore this email or contact our support team.</p>
                <p style="margin:40px 0 0 0">Cheers,<br />The ${APP_NAME} Team</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f0f3f8;padding:16px;text-align:center;font-size:12px;color:#6c757d">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

	await smtpTransport.sendMail({
		from: `${APP_NAME} <no-reply@predictaspend.com>`,
		to,
		subject: `${APP_NAME} Login Code: ${code}`,
		html,
	});
};

// ------------------------ SMS -------------------------
export const sendSms = async (to: string, code: string) => {
	const body = `${APP_NAME}: your verification code is ${code}. Expires in 5 min. If you didn’t request, ignore this message.`;
	await twilioClient.messages.create({
		to,
		from: process.env.TWILIO_FROM as string,
		body,
	});
};
