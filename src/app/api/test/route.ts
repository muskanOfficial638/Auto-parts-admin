// src/app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;


  const res = await fetch('http://54.80.119.79:8000/v1/admin/logs/eec14db0-a3ae-4377-b1ee-fce6a5f55f80', {
    headers: {
       Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data);
}
