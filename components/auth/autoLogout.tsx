"use client";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AutoLogout() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && 
        !pathname.startsWith("/admin") && 
        !pathname.startsWith("/auth") && 
        pathname !== "/"
    ) {
      console.log("Admin tersesat ke halaman yang tidak dikenal -> Logout.");
      signOut({ redirect: false });
    }
  }, [pathname, session]);

  return null;
}