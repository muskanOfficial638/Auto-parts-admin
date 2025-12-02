/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const imagePath = params.path.join("/");
  const url = `http://54.80.119.79:8000/image/${imagePath}`;

  const response = await fetch(url);

  const headers = new Headers(response.headers);
  headers.set("Content-Type", response.headers.get("Content-Type") || "image/png");

  return new NextResponse(response.body, { headers });
}
