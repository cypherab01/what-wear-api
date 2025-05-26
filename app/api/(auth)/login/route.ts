import connectToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          error:
            "Email not verified. This doesn't ensure you have entered your correct credentials. Please verify your email first.",
        },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful.", user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
