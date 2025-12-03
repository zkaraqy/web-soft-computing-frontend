"use client";

import React, { useState } from "react";

interface GenerationInfo {
  generation: number;
  best_distance: number;
  avg_distance: number;
  min_distance: number;
  max_distance: number;
  population_sample: number[][];
}

interface TSPResult {
  best_route_idx: number[];
  best_route: string[];
  best_distance: number;
  history: number[];
  generations_info: GenerationInfo[];
  parameters: {
    pop_size: number;
    generations: number;
    tournament_k: number;
    pc: number;
    pm: number;
    elite_size: number;
  };
}

const API_BASE = "http://127.0.0.1:5000";

export default function Tugas4Page() {
  const [popSize, setPopSize] = useState<number>(250);
  const [generations, setGenerations] = useState<number>(200);
  const [tournamentK, setTournamentK] = useState<number>(5);
  const [pc, setPc] = useState<number>(0.8);
  const [pm, setPm] = useState<number>(0.2);
  const [eliteSize, setEliteSize] = useState<number>(1);
  const [seed, setSeed] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [result, setResult] = useState<TSPResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeGeneration, setActiveGeneration] = useState<number>(0);

  async function runGA() {
    setError(null);
    setResult(null);
    setRunning(true);
    setActiveGeneration(0);
    try {
      const body = {
        pop_size: popSize,
        generations: generations,
        tournament_k: tournamentK,
        pc: pc,
        pm: pm,
        elite_size: eliteSize,
        seed: seed ? Number(seed) : null,
      };

      const res = await fetch(`${API_BASE}/api/v1/tsp/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unknown error");
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setRunning(false);
    }
  }

  const GenerationDisplay = ({ gen }: { gen: GenerationInfo }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            📊 Generasi {gen.generation}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-xs text-gray-600">Best Distance</p>
              <p className="text-lg font-bold text-green-700">
                {gen.best_distance.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600">Avg Distance</p>
              <p className="text-lg font-bold text-blue-700">
                {gen.avg_distance.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <p className="text-xs text-gray-600">Min Distance</p>
              <p className="text-lg font-bold text-orange-700">
                {gen.min_distance.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-xs text-gray-600">Max Distance</p>
              <p className="text-lg font-bold text-red-700">
                {gen.max_distance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 mb-2">
            🧬 Sample Populasi (5 individu pertama)
          </h4>
          <div className="bg-gray-50 p-4 rounded overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">#</th>
                  <th className="text-left py-2 px-2">Kromosom (Urutan Kota)</th>
                </tr>
              </thead>
              <tbody>
                {gen.population_sample.map((individual, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-2">{idx + 1}</td>
                    <td className="py-2 px-2 font-mono">
                      [{individual.join(", ")}]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ConvergenceChart = () => {
    if (!result || !result.history) return null;

    const maxDist = Math.max(...result.history);
    const minDist = Math.min(...result.history);
    const range = maxDist - minDist || 1;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Awal</p>
            <p className="font-bold text-gray-900">
              {result.history[0].toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Rata-rata</p>
            <p className="font-bold text-gray-900">
              {(
                result.history.reduce((a, b) => a + b, 0) /
                result.history.length
              ).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Akhir</p>
            <p className="font-bold text-green-700">
              {result.history[result.history.length - 1].toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const FinalResult = () => {
    if (!result) return null;

    return (
      <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🏆 Hasil Akhir
        </h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Jarak Terbaik</p>
            <p className="text-4xl font-bold text-green-700">
              {result.best_distance.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Rute Terbaik</p>
            <div className="flex flex-wrap gap-2 items-center">
              {result.best_route.map((city, idx) => (
                <React.Fragment key={idx}>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                    {city}
                  </span>
                  {idx < result.best_route.length - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </React.Fragment>
              ))}
              <span className="text-gray-400">→</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
                {result.best_route[0]}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              Kromosom (Urutan Indeks)
            </p>
            <p className="font-mono text-sm text-gray-800">
              [{result.best_route_idx.join(", ")}]
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Parameter</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Pop Size:</span>{" "}
                <span className="font-semibold">{result.parameters.pop_size}</span>
              </div>
              <div>
                <span className="text-gray-600">Generations:</span>{" "}
                <span className="font-semibold">{result.parameters.generations}</span>
              </div>
              <div>
                <span className="text-gray-600">Crossover:</span>{" "}
                <span className="font-semibold">{result.parameters.pc}</span>
              </div>
              <div>
                <span className="text-gray-600">Mutation:</span>{" "}
                <span className="font-semibold">{result.parameters.pm}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-8 px-4 text-gray-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Traveling Salesman Problem - Algoritma Genetika
          </h1>
          <p className="text-lg text-gray-600">Tugas 4 - Soft Computing</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ⚙️ Parameter Algoritma
              </h2>

              {/* Population Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ukuran Populasi (Pop Size)
                </label>
                <input
                  type="number"
                  value={popSize}
                  onChange={(e) => setPopSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                  min={10}
                  max={500}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 10 - 500</p>
              </div>

              {/* Generations */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Generasi
                </label>
                <input
                  type="number"
                  value={generations}
                  onChange={(e) => setGenerations(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                  min={10}
                  max={1000}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 10 - 1000</p>
              </div>

              {/* Crossover Rate */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probabilitas Crossover: {pc.toFixed(2)}
                </label>
                <input
                  type="range"
                  value={pc}
                  onChange={(e) => setPc(Number(e.target.value))}
                  className="w-full"
                  min={0}
                  max={1}
                  step={0.05}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 0.0 - 1.0</p>
              </div>

              {/* Mutation Rate */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probabilitas Mutasi: {pm.toFixed(2)}
                </label>
                <input
                  type="range"
                  value={pm}
                  onChange={(e) => setPm(Number(e.target.value))}
                  className="w-full"
                  min={0}
                  max={1}
                  step={0.05}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 0.0 - 1.0</p>
              </div>

              {/* Run Button */}
              <button
                onClick={runGA}
                disabled={running}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {running ? "🔄 Memproses..." : "▶️ Jalankan Algoritma"}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🗺️ Traveling Salesman Problem
              </h2>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-700 mb-3">
                  <strong>Deskripsi:</strong> Mencari rute terpendek yang
                  mengunjungi setiap kota tepat satu kali dan kembali ke kota
                  awal.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Representasi Kromosom:
                    </p>
                    <p className="text-xs text-gray-600">
                      Permutasi urutan kota (contoh: [0, 2, 1, 3])
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Fitness Function:
                    </p>
                    <p className="text-xs text-gray-600">
                      Total jarak perjalanan (minimize)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Crossover:
                    </p>
                    <p className="text-xs text-gray-600">Ordered Crossover (OX)</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Mutation:
                    </p>
                    <p className="text-xs text-gray-600">Swap Mutation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {/* {!result && !error && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-gray-600">
                  Atur parameter dan klik tombol "Jalankan Algoritma" untuk
                  memulai.
                </p>
              </div>
            )} */}

            {result && (
              <>
                {/* Final Result */}
                <FinalResult />

                {/* Convergence Chart */}
                <ConvergenceChart />

                {/* Generation Navigator */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    🔄 Navigasi Generasi
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.generations_info &&
                      result.generations_info.map((gen, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveGeneration(idx)}
                          className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            activeGeneration === idx
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                          }`}
                        >
                          Gen {gen.generation}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Generation Display */}
                {result.generations_info &&
                  result.generations_info[activeGeneration] && (
                    <GenerationDisplay
                      gen={result.generations_info[activeGeneration]}
                    />
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
