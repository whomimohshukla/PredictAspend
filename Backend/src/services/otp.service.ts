import bcrypt from 'bcryptjs';
import OTP from '../models/otpModel';


export const generateAndStoreOtp = async (contact: string, mode: 'email' | 'phone') => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(code, 10);
  const query = mode === 'email' ? { email: contact } : { phone: contact };
  const doc = await OTP.findOneAndUpdate(
    query,
    mode === 'email'
      ? { email: contact, otp: hash, createdAt: new Date() }
      : { phone: contact, otp: hash, createdAt: new Date() },
    { upsert: true, new: true }
  );
  return code;
};

export const verifyOtp = async (
  contact: string,
  code: string,
  mode: 'email' | 'phone'
) => {
  const record = await OTP.findOne(mode === 'email' ? { email: contact } : { phone: contact });
  if (!record) return false;
  const ok = await bcrypt.compare(code, record.otp);
  if (!ok) return false;
  await record.deleteOne(); // one-time use
  return true;
};
