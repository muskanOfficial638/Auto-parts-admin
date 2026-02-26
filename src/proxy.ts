import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authApiPath } from "./app/utils/api";



export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  async function genToken() {
    try {
      const res = await fetch(`${authApiPath}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenR }),
      });
      const data = await res.json();
      if (data.success) {
        const response = NextResponse.next();
        response.cookies.set("ATXAT", data.access_token, {
          httpOnly: true,
          secure: true,
          path: "/",
        });
        return response;
      } else {
        url.pathname = "/signin";
        return NextResponse.redirect(url);
      }

    } catch (err) {
       console.error(err)
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname === "/signin" || url.pathname === "/api/auth/login" || url.pathname.startsWith("/images/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ATXAT")?.value;
  const tokenR = request.cookies.get("ATXRT")?.value;

  if (token) {
    try {
      const res = await fetch(`${authApiPath}/auth/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });

      if (res.status == 200) {
        return NextResponse.next();
      } else if (res.status == 401) {
        return genToken()
      } else {
        url.pathname = "/signin";
        return NextResponse.redirect(url);
      }
    } catch (err) {
      url.pathname = "/signin";
      return NextResponse.redirect(url);
      console.error(err)
    }
  }
  else if (!tokenR) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
  if (!token && tokenR) {
    return genToken()

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
