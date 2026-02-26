"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("/api/auth/logout");
        localStorage.removeItem("autoPartsUserData");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("lastActivity");
        router.push("/signin");
      } catch (err) {
   
        console.error(err);
      }
    };

    logout();
  }, [router]);

  return null; // optionally you can show a spinner
}