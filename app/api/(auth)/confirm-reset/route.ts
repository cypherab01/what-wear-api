import { isPasswordStrong } from "@/helpers/check-password-strength";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, otp, newPassword } = await req.json();

    if (!isPasswordStrong(newPassword)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email, otp });
    if (!user || user.otpExpires! < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 401 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
