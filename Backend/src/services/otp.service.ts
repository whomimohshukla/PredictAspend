import bcrypt from 'bcryptjs';
import OTP from '../models/otpModel';

const TTL_MS = 5 * 60 * 1000; // 5 minutes

export const createOtp = async (contact: { email?: string; phone?: string }) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(code, 10);
  const doc = await OTP.findOneAndUpdate(
    contact,
    { ...contact, otp: hash, createdAt: new Date() },
    { upsert: true, new: true }
  );
  return { code, doc };
};

export const validateOtp = async (
  contact: { email?: string; phone?: string },
  code: string
) => {
  const record = await OTP.findOne(contact);
  if (!record) return false;
  const ok = await bcrypt.compare(code, record.otp);
  if (!ok) return false;
  await record.deleteOne(); // one-time use
  return true;
};
