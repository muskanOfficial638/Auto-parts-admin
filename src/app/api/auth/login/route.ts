import { NextResponse } from "next/server";
import { authApiPath } from "@/app/utils/api";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${authApiPath}/auth/login` ,{
    method: "POST",
    body: JSON.stringify(body),
    headers:{ "Content-Type": "application/json" }
  });

  const data = await res.json();
  const response = NextResponse.json(data.user);
  if(data.user.role === "admin"){
  response.cookies.set("ATXAT", data.access_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  response.cookies.set("ATXRT", data.refresh_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

}

  return response;
}
