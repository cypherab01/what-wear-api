import { generateOtp } from "@/helpers/generateOtp";
import { sendEmail } from "@/helpers/send-mail";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please signup first." },
        { status: 404 }
      );
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      email,
      emailType: "RESET",
    });

    return NextResponse.json(
      { message: "OTP sent to email." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
