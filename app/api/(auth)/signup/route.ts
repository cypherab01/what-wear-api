import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { generateOtp } from "@/helpers/generateOtp";
import { User } from "@/models/user.model";
import { sendEmail } from "@/helpers/send-mail";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (!existingUser?.isVerified) {
      await sendEmail({
        email,
        emailType: "VERIFY",
      });
      return NextResponse.json(
        {
          error: "User not verified, please check your email for verification",
        },
        { status: 400 }
      );
    }

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { error: "User already exists, please login" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    });

    await sendEmail({
      email,
      emailType: "VERIFY",
    });

    return NextResponse.json(
      {
        message: "Signup successful! Please verify your email.",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
