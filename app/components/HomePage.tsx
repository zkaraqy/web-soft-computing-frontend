/**
 * Modern Homepage - Inspired by reference image
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
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

const algorithms: AlgorithmCard[] = [
  {
    title: "Fuzzy Logic",
    description:
      "Implementasi logika fuzzy untuk pengambilan keputusan dengan ketidakpastian",
    icon: "🔮",
    color: "from-purple-500 to-indigo-600",
    href: "/algorithms/fuzzy",
    status: "active",
  },
  {
    title: "Neural Network",
    description:
      "Jaringan saraf tiruan untuk pattern recognition dan machine learning",
    icon: "🧠",
    color: "from-blue-500 to-cyan-600",
    href: "/algorithms/neural-network",
    status: "active",
  },
  {
    title: "Genetic Algorithm",
    description: "Algoritma evolusioner untuk optimasi dan pencarian solusi",
    icon: "🧬",
    color: "from-green-500 to-emerald-600",
    href: "/algorithms/genetic",
    status: "coming-soon",
  },
  {
    title: "Particle Swarm",
    description: "Optimasi berbasis perilaku kawanan untuk problem solving",
    icon: "✨",
    color: "from-orange-500 to-red-600",
    href: "/algorithms/pso",
    status: "coming-soon",
  },
];

const features = [
  {
    title: "Interactive Playground",
    description:
      "Coba algoritma secara langsung dengan parameter yang bisa disesuaikan",
    icon: "🎮",
  },
  {
    title: "Visualisasi Real-time",
    description:
      "Lihat bagaimana algoritma bekerja dengan visualisasi interaktif",
    icon: "📊",
  },
  {
    title: "Dokumentasi Lengkap",
    description:
      "Panduan lengkap untuk setiap algoritma dengan contoh implementasi",
    icon: "📚",
  },
  {
    title: "API Integration",
    description:
      "RESTful API yang siap digunakan untuk integrasi dengan sistem lain",
    icon: "🔌",
  },
];

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
            {/* <Badge variant="info" className="mb-4">
              {apiStatus === "connected"
                ? "✓ API Connected"
                : "⚠ API Disconnected"}
            </Badge> */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Soft Computing
              {/* <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Algorithms
              </span> */}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Kumpulan tugas dan implementasi algoritma soft computing yang dikembangkan oleh Muhammad Azka Raki
            </p>
            {/* <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg">
                Get Started →
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div> */}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {/* <section className="py-12 px-6 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">4+</div>
              <div className="text-gray-600">Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">12+</div>
              <div className="text-gray-600">Examples</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">API</div>
              <div className="text-gray-600">Ready</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Algorithms Grid */}
      {/* <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Available Algorithms
          </h2>
          <p className="text-gray-600 mb-8">
            Pilih algoritma yang ingin Anda eksplorasi
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {algorithms.map((algo) => (
              <Card
                key={algo.title}
                hover={algo.status === "active"}
                onClick={
                  algo.status === "active"
                    ? () => (window.location.href = algo.href)
                    : undefined
                }
                className="relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${algo.color} opacity-10 rounded-full -mr-16 -mt-16`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{algo.icon}</div>
                    {algo.status === "coming-soon" && (
                      <Badge variant="warning">Coming Soon</Badge>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {algo.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{algo.description}</p>

                  {algo.status === "active" && (
                    <Link href={algo.href}>
                      <Button variant="outline" size="sm">
                        Explore →
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      {/* <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Kenapa Pilih Platform Ini?
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Platform pembelajaran soft computing yang komprehensif dengan
            berbagai fitur unggulan
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-linear-to-r from-indigo-600 to-purple-600 text-white text-center p-12">
            <h2 className="text-3xl font-bold mb-4">Siap Untuk Memulai?</h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Eksplorasi dunia soft computing dan tingkatkan pemahaman Anda
              tentang AI dan machine learning
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                Start Learning
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                View Tutorials
              </Button>
            </div>
          </Card>
        </div>
      </section> */}
    </div>
  );
}
