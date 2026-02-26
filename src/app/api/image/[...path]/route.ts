import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;

    if (!path || !path.length) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const imagePath = path.join("/");
    const url = `http://54.80.119.79:8000/image/${imagePath}`;

    const response = await fetch(url);

    if (!response.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType =
      response.headers.get("content-type") ?? "image/jpeg";

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("[image-proxy]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}