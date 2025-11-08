/**
 * Modern Homepage - Inspired by reference image
 */

"use client";

import { useState, useEffect } from "react";
import Spinner from "./ui/Spinner";
import { apiService } from "../lib/api/service";

interface AlgorithmCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  status: "active" | "coming-soon";
}



export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      await apiService.health.check();
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("disconnected");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-gray-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Soft Computing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Kumpulan tugas dan implementasi algoritma soft computing yang dikembangkan oleh Muhammad Azka Raki
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
