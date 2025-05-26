import nodemailer from "nodemailer";
import { generateOtp } from "./generateOtp";
import { User } from "@/models/user.model";

export const sendEmail = async ({
  email,
  emailType,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
}) => {
  try {
    const otp = generateOtp(); // Generate a 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    if (emailType === "VERIFY") {
      await User.findOneAndUpdate({ email }, { otp, otpExpires: otpExpiry });
    } else if (emailType === "RESET") {
      await User.findOneAndUpdate({ email }, { otp, otpExpires: otpExpiry });
    } else {
      throw new Error("Invalid email type");
    }

    const transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_PORT!),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_MAILER,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <p>Your OTP for ${
          emailType === "VERIFY" ? "email verification" : "password reset"
        } is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
