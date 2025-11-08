"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/app/lib/api/service";

export default function Header() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await apiService.health.check();
      setIsHealthy(response.success);
    } catch (error) {
      console.error("Health check failed:", error);
      setIsHealthy(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-30 px-6">
      <div className="h-full flex items-center justify-between">
      </div>
    </header>
  );
}
