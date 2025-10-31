/**
 * Tugas 2: Fuzzy Mamdani Production System
 * Sistem inferensi fuzzy untuk menghitung rekomendasi produksi
 */

"use client";

import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FuzzyResult {
  input: {
    demand: number;
    inventory: number;
  };
  membership: {
    demand: {
      TURUN: number;
      NAIK: number;
    };
    inventory: {
      SEDIKIT: number;
      BANYAK: number;
    };
  };
  rule_firings: Array<{
    rule: number;
    lhs: string;
    demand_term: string;
    inventory_term: string;
    output_term: string;
    demand_degree: number;
    inventory_degree: number;
    strength: number;
    description: string;
  }>;
  aggregated_samples: {
    xs: number[];
    mu: number[];
  };
  defuzzified: number;
  recommendation: {
    value: number;
    min_allowed: number;
    max_allowed: number;
    unit: string;
  };
  membership_functions?: any;
  rules?: any[];
}

interface MembershipFunctions {
  demand: {
    x: number[];
    TURUN: number[];
    NAIK: number[];
  };
  inventory: {
    x: number[];
    SEDIKIT: number[];
    BANYAK: number[];
  };
  production: {
    x: number[];
    BERKURANG: number[];
    BERTAMBAH: number[];
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export default function FuzzyMamdaniPage() {
  // Input states
  const [demand, setDemand] = useState<number>(4000);
  const [inventory, setInventory] = useState<number>(300);
  const [resolution, setResolution] = useState<number>(1000);

  // Result states
  const [result, setResult] = useState<FuzzyResult | null>(null);
  const [membershipFunctions, setMembershipFunctions] =
    useState<MembershipFunctions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [demandRange, setDemandRange] = useState<[number, number]>([
    1000, 5000,
  ]);
  const [inventoryRange, setInventoryRange] = useState<[number, number]>([
    100, 600,
  ]);
  const [productionRange, setProductionRange] = useState<[number, number]>([
    2000, 7000,
  ]);

  // Load membership functions on mount
  useEffect(() => {
    loadMembershipFunctions();
  }, []);

  const loadMembershipFunctions = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/mamdani/membership-functions`
      );
      const data = await response.json();

      if (data.success) {
        setMembershipFunctions(data.data);
      }
    } catch (err) {
      console.error("Failed to load membership functions:", err);
    }
  };

  const handleCompute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/v1/mamdani/compute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demand,
          inventory,
          params: {
            demand_range: demandRange,
            inventory_range: inventoryRange,
            production_range: productionRange,
            resolution,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || "Computation failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  // Chart data for membership functions
  const getDemandChartData = () => {
    if (!membershipFunctions) return null;

    return {
      labels: membershipFunctions.demand.x.map((x) => Math.round(x)),
      datasets: [
        {
          label: "TURUN",
          data: membershipFunctions.demand.TURUN,
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0,
        },
        {
          label: "NAIK",
          data: membershipFunctions.demand.NAIK,
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0,
        },
      ],
    };
  };

  const getInventoryChartData = () => {
    if (!membershipFunctions) return null;

    return {
      labels: membershipFunctions.inventory.x.map((x) => Math.round(x)),
      datasets: [
        {
          label: "SEDIKIT",
          data: membershipFunctions.inventory.SEDIKIT,
          borderColor: "rgb(249, 115, 22)",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          fill: true,
          tension: 0,
        },
        {
          label: "BANYAK",
          data: membershipFunctions.inventory.BANYAK,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0,
        },
      ],
    };
  };

  const getProductionChartData = () => {
    if (!membershipFunctions) return null;

    return {
      labels: membershipFunctions.production.x.map((x) => Math.round(x)),
      datasets: [
        {
          label: "BERKURANG",
          data: membershipFunctions.production.BERKURANG,
          borderColor: "rgb(168, 85, 247)",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          fill: true,
          tension: 0,
        },
        {
          label: "BERTAMBAH",
          data: membershipFunctions.production.BERTAMBAH,
          borderColor: "rgb(20, 184, 166)",
          backgroundColor: "rgba(20, 184, 166, 0.1)",
          fill: true,
          tension: 0,
        },
      ],
    };
  };

  const getAggregatedChartData = () => {
    if (!result) return null;

    return {
      labels: result.aggregated_samples.xs.map((x) => Math.round(x)),
      datasets: [
        {
          label: "Aggregated Output",
          data: result.aggregated_samples.mu,
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.3)",
          fill: true,
          tension: 0,
          pointRadius: 0,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: "Membership Degree (μ)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* <Badge variant="info" className="mb-4">
            🔮 Tugas 2: Fuzzy Mamdani
          </Badge> */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistem Inferensi Fuzzy Mamdani - Produksi
          </h1>
          <p className="text-gray-600 text-lg">
            Menghitung rekomendasi produksi (kemasan/hari) berdasarkan
            permintaan dan persediaan menggunakan metode Mamdani dengan fungsi
            keanggotaan linear
          </p>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Input Card */}
          <Card>
            <h2 className="text-xl font-semibold text-black mb-4">
              Input Parameters
            </h2>

            <div className="space-y-6">
              {/* Demand Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permintaan (demand):{" "}
                  <span className="text-indigo-600 font-bold">{demand}</span>{" "}
                  kemasan/hari
                </label>
                <input
                  type="range"
                  min={demandRange[0]}
                  max={demandRange[1]}
                  step="100"
                  value={demand}
                  onChange={(e) => setDemand(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{demandRange[0]}</span>
                  <span>{demandRange[1]}</span>
                </div>
              </div>

              {/* Inventory Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persediaan (inventory):{" "}
                  <span className="text-indigo-600 font-bold">{inventory}</span>{" "}
                  kemasan
                </label>
                <input
                  type="range"
                  min={inventoryRange[0]}
                  max={inventoryRange[1]}
                  step="10"
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{inventoryRange[0]}</span>
                  <span>{inventoryRange[1]}</span>
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showAdvanced ? "▼" : "▶"} Advanced Settings
              </button>

              {showAdvanced && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Configuration
                  </h3>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Resolution (sample points):
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="5000"
                      step="100"
                      value={resolution}
                      onChange={(e) => setResolution(Number(e.target.value))}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    Note: Rules are fixed and cannot be modified
                  </p>
                </div>
              )}

              {/* Compute Button */}
              <Button
                variant="primary"
                className="w-full"
                onClick={handleCompute}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Computing...
                  </>
                ) : (
                  "🧮 Compute Production"
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Result Card */}
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-black mb-4">
              Hasil Perhitungan
            </h2>

            {!result ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">⚙️</p>
                <p>Klik "Compute Production" untuk melihat hasil</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Result */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-90 mb-1">
                    Rekomendasi Produksi:
                  </p>
                  <p className="text-5xl font-bold mb-2">
                    {Math.round(result.defuzzified).toLocaleString()}
                  </p>
                  <p className="text-sm opacity-90">
                    {result.recommendation.unit} (range:{" "}
                    {result.recommendation.min_allowed} -{" "}
                    {result.recommendation.max_allowed})
                  </p>
                </div>

                {/* Membership Degrees */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-2">
                      Permintaan ({result.input.demand})
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-700">TURUN:</span>
                        <span className="font-mono font-bold text-red-900">
                          {result.membership.demand.TURUN.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-700">NAIK:</span>
                        <span className="font-mono font-bold text-red-900">
                          {result.membership.demand.NAIK.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Persediaan ({result.input.inventory})
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">SEDIKIT:</span>
                        <span className="font-mono font-bold text-blue-900">
                          {result.membership.inventory.SEDIKIT.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">BANYAK:</span>
                        <span className="font-mono font-bold text-blue-900">
                          {result.membership.inventory.BANYAK.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Rules Table */}
        {result && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Evaluasi Aturan (Rules)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Rule
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Condition
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Demand μ
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Inventory μ
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Firing Strength (min)
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Output
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {result.rule_firings.map((rule) => {
                    const isActive = rule.strength > 0;
                    return (
                      <tr
                        key={rule.rule}
                        className={isActive ? "bg-green-50" : ""}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          #{rule.rule}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {rule.lhs}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500 font-mono text-sm">
                          {rule.demand_degree.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500 font-mono text-sm">
                          {rule.inventory_degree.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-mono font-bold ${
                              isActive ? "text-green-700" : "text-gray-400"
                            }`}
                          >
                            {rule.strength.toFixed(4)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={
                              rule.output_term === "BERKURANG"
                                ? "warning"
                                : "success"
                            }
                          >
                            {rule.output_term}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isActive ? (
                            <Badge variant="success">✓ Active</Badge>
                          ) : (
                            <Badge variant="default">Inactive</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Operator AND = min:</strong> Firing strength dihitung
                dengan mengambil nilai minimum dari derajat keanggotaan input.
              </p>
            </div>
          </Card>
        )}

        {/* Visualization Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Membership Functions - Demand */}
          <Card>
            <h3 className="text-lg font-semibold text-black mb-4">
              Fungsi Keanggotaan: Permintaan
            </h3>
            <div className="h-64">
              {membershipFunctions && getDemandChartData() && (
                <Line data={getDemandChartData()!} options={chartOptions} />
              )}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <p>
                <strong>TURUN:</strong> triangular(1000, 1000, 5000) - shoulder
                kiri, formula: (5000-x)/4000
              </p>
              <p>
                <strong>NAIK:</strong> triangular(1000, 5000, 5000) - shoulder
                kanan, formula: (x-1000)/4000
              </p>
            </div>
          </Card>

          {/* Membership Functions - Inventory */}
          <Card>
            <h3 className="text-lg font-semibold text-black mb-4">
              Fungsi Keanggotaan: Persediaan
            </h3>
            <div className="h-64">
              {membershipFunctions && getInventoryChartData() && (
                <Line data={getInventoryChartData()!} options={chartOptions} />
              )}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <p>
                <strong>SEDIKIT:</strong> triangular(100, 100, 600) - shoulder
                kiri, formula: (600-x)/500
              </p>
              <p>
                <strong>BANYAK:</strong> triangular(100, 600, 600) - shoulder
                kanan, formula: (x-100)/500
              </p>
            </div>
          </Card>

          {/* Membership Functions - Production */}
          <Card>
            <h3 className="text-lg font-semibold text-black mb-4">
              Fungsi Keanggotaan: Produksi (Output)
            </h3>
            <div className="h-64">
              {membershipFunctions && getProductionChartData() && (
                <Line data={getProductionChartData()!} options={chartOptions} />
              )}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <p>
                <strong>BERKURANG:</strong> triangular(2000, 2000, 7000) -
                shoulder kiri, formula: (7000-x)/5000
              </p>
              <p>
                <strong>BERTAMBAH:</strong> triangular(2000, 7000, 7000) -
                shoulder kanan, formula: (x-2000)/5000
              </p>
            </div>
          </Card>

          {/* Aggregated Output */}
          {result && (
            <Card>
              <h3 className="text-lg font-semibold text-black mb-4">
                Output Teragregasi & Defuzzifikasi
              </h3>
              <div className="h-64">
                {getAggregatedChartData() && (
                  <Line
                    data={getAggregatedChartData()!}
                    options={chartOptions}
                  />
                )}
              </div>
              <div className="mt-3 space-y-2">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-900">
                    <strong>Metode Agregasi:</strong> max (mengambil nilai
                    maksimum dari semua clipped outputs)
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900">
                    <strong>Metode Defuzzifikasi:</strong> Centroid (center of
                    gravity)
                  </p>
                  <p className="text-xs text-purple-700 mt-1 font-mono">
                    crisp_output = Σ(x × μ(x)) / Σ(μ(x))
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Step-by-Step Explanation */}
        {result && (
          <Card>
            <h2 className="text-xl text-black font-semibold mb-4">
              Langkah Perhitungan Detail
            </h2>

            <div className="space-y-4">
              {/* Step 1: Fuzzification */}
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 mb-2">
                  1️⃣ Fuzzifikasi (Crisp → Fuzzy)
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    <strong>Input Crisp:</strong> Demand = {result.input.demand}
                    , Inventory = {result.input.inventory}
                  </p>
                  <p>
                    <strong>Derajat Keanggotaan:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      μ<sub>TURUN</sub>({result.input.demand}) ={" "}
                      {result.membership.demand.TURUN.toFixed(4)}
                    </li>
                    <li>
                      μ<sub>NAIK</sub>({result.input.demand}) ={" "}
                      {result.membership.demand.NAIK.toFixed(4)}
                    </li>
                    <li>
                      μ<sub>SEDIKIT</sub>({result.input.inventory}) ={" "}
                      {result.membership.inventory.SEDIKIT.toFixed(4)}
                    </li>
                    <li>
                      μ<sub>BANYAK</sub>({result.input.inventory}) ={" "}
                      {result.membership.inventory.BANYAK.toFixed(4)}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2: Rule Evaluation */}
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-900 mb-2">
                  2️⃣ Evaluasi Aturan (Inference)
                </h3>
                <div className="space-y-2 text-sm text-green-800">
                  <p>
                    <strong>Operator AND = min:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {result.rule_firings.map((rule) => (
                      <li key={rule.rule}>
                        Rule {rule.rule}: min({rule.demand_degree.toFixed(4)},{" "}
                        {rule.inventory_degree.toFixed(4)}) ={" "}
                        <strong>{rule.strength.toFixed(4)}</strong>
                        {rule.strength > 0 && (
                          <span className="text-green-600 font-bold">
                            {" "}
                            ✓ FIRES
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step 3: Implication */}
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  3️⃣ Implikasi (Mamdani - Clipping)
                </h3>
                <p className="text-sm text-yellow-800">
                  Setiap rule yang aktif akan mem-clip (truncate) fungsi
                  keanggotaan output sesuai firing strength menggunakan operator
                  min.
                </p>
              </div>

              {/* Step 4: Aggregation */}
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-900 mb-2">
                  4️⃣ Agregasi (Union of Outputs)
                </h3>
                <p className="text-sm text-purple-800">
                  Semua clipped outputs digabungkan menggunakan operator max
                  untuk membentuk satu fungsi keanggotaan output final.
                </p>
              </div>

              {/* Step 5: Defuzzification */}
              <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  5️⃣ Defuzzifikasi (Fuzzy → Crisp)
                </h3>
                <div className="space-y-2 text-sm text-indigo-800">
                  <p>
                    <strong>Metode: Centroid (Center of Gravity)</strong>
                  </p>
                  <p className="font-mono bg-indigo-100 p-2 rounded">
                    crisp = Σ(x × μ(x)) / Σ(μ(x))
                  </p>
                  <p className="text-lg font-bold text-indigo-900">
                    Hasil: {result.defuzzified.toFixed(2)}{" "}
                    {result.recommendation.unit}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <Card className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-1 text-black text-sm">
              Linear Functions
            </h3>
            <p className="text-xs text-gray-600">Triangular & Shoulder</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1 text-black text-sm">
              Mamdani Method
            </h3>
            <p className="text-xs text-gray-600">Min-Max Inference</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="font-semibold mb-1 text-black text-sm">Centroid</h3>
            <p className="text-xs text-gray-600">Center of Gravity</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">🔢</div>
            <h3 className="font-semibold mb-1 text-black text-sm">4 Rules</h3>
            <p className="text-xs text-gray-600">Fixed Logic</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
