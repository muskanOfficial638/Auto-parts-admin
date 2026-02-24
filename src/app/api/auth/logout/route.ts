import { NextResponse } from "next/server";

export async function POST() {
  // Clear cookie
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("ATXRT", "", { path: "/", maxAge: 0 });
  response.cookies.set("ATXAT", "", { path: "/", maxAge: 0 });
  return response;
}