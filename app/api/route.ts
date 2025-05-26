import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { status: "ok", date: new Date().toISOString().split("T")[0] },
    { status: 200 }
  );
}
