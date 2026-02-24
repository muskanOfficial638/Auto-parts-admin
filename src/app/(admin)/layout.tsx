"use client";

import Loader from "@/components/common/Loader";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  const [loading, setLoading] = useState<boolean>(true);
  const [autoPartsUserData, setAutoPartsUserData] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("autoPartsUserData");
    const loginTime = localStorage.getItem("loginTime");

    // User NOT logged in → redirect
    if (!user || !loginTime) {
      router.push("/logout");
      return; // Stop the flow
    }

    // Check if login is older than 12 hours
    const ONE_DAY = 12 * 60 * 60 * 1000;  // currently check for 12 years
    const isExpired = Date.now() - Number(loginTime) > ONE_DAY;

    if (isExpired) {
      // Clear old session
      localStorage.removeItem("autoPartsUserData");
      localStorage.removeItem("loginTime");
      router.push("/logout");
      return;
    }

    // User logged in → load normally
    setAutoPartsUserData(user);
    setTimeout(() => setLoading(false), 1000);
  }, [router]);

  // Show loader while checking or redirecting
  if (loading) {
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  }

  // Prevent flash before router.push
  if (!autoPartsUserData) return null;

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`overflow-hidden flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
