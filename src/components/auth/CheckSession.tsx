"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckSession() {
  const router = useRouter();
  
  useEffect(() => {
    const MAX_SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours
    const INACTIVITY_MS = 10 * 60 * 1000; // FOR TESTING: 10 minutes

    const logout = () => {
      localStorage.removeItem("autoPartsUserData");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("lastActivity");
      localStorage.clear();
      router.replace("/logout");
    };

    // 🔍 Function that checks session continuously
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      const lastActivity = localStorage.getItem("lastActivity");

      const now = Date.now();

      if (!loginTime) {
        logout();
        return;
      }

      if (now - Number(loginTime) > MAX_SESSION_MS) {
        logout();
        return;
      }

      if (lastActivity && now - Number(lastActivity) > INACTIVITY_MS) {
        logout();
        return;
      }
    };

    const interval = setInterval(checkSession, 20 * 1000);
    
    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [router]);

  return null;
}
