import connectToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email, otp });

    if (!user || user.otpExpires! < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
