/**
 * Fuzzy Logic Page
 */

"use client";

import { useState } from "react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { apiService } from "@/app/lib/api/service";

export default function FuzzyPage() {
  const [temperature, setTemperature] = useState<number>(25);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    setLoading(true);
    try {
      const response = await apiService.fuzzy.classifyTemperature(temperature);
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="info" className="mb-4">
            Fuzzy Logic Algorithm
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔮 Fuzzy Logic Classifier
          </h1>
          <p className="text-gray-600 text-lg">
            Klasifikasi suhu menggunakan logika fuzzy dengan membership function
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Input Parameter</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C): {temperature}
                </label>
                <input
                  type="range"
                  min="-20"
                  max="60"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-20°C</span>
                  <span>60°C</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleClassify}
                disabled={loading}
              >
                {loading ? "Classifying..." : "Classify Temperature"}
              </Button>
            </div>
          </Card>

          {/* Result Section */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Classification Result</h2>
            
            {result ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Classification:</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {result.classification}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Memberships:</p>
                  <div className="space-y-2">
                    {Object.entries(result.memberships).map(([key, value]: any) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{key.replace("_", " ")}</span>
                        <span className="font-medium">{value.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Adjust temperature and click classify to see results</p>
              </div>
            )}
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Membership Functions</h3>
              <p className="text-sm text-gray-600">
                Triangular & Trapezoidal
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Classification</h3>
              <p className="text-sm text-gray-600">
                5 Temperature Categories
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Real-time</h3>
              <p className="text-sm text-gray-600">
                Instant Results
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
