"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Solo ejecutamos en el cliente
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        router.replace("/");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  return isAuthenticated;
}
