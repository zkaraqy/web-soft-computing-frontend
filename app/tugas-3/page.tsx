"use client";

import { useState } from "react";

interface Item {
  weight: number;
  value: number;
}

interface Items {
  [key: string]: Item;
}

interface Individual {
  index: number;
  chromosome: number[];
  items: string[];
  weight: number;
  value: number;
  fitness: number;
  is_best?: boolean;
}

interface CrossoverOperation {
  parent1: number[];
  parent2: number[];
  child1: number[];
  child2: number[];
  crossed: boolean;
}

interface MutationOperation {
  before: number[];
  after: number[];
  mutated: boolean;
}

interface GenerationData {
  generation: number;
  type: string;
  population?: Individual[];
  population_before?: Individual[];
  best_individual: {
    chromosome: number[];
    items: string[];
    weight: number;
    value: number;
    fitness: number;
  };
  selection?: {
    method: string;
    selected_pairs: number;
  };
  crossover?: {
    rate: number;
    operations: CrossoverOperation[];
  };
  mutation?: {
    rate: number;
    operations: MutationOperation[];
  };
  statistics?: {
    avg_fitness: number;
    max_fitness: number;
    min_fitness: number;
    std_fitness: number;
  };
  avg_fitness?: number;
  max_fitness?: number;
  min_fitness?: number;
}

interface GAResult {
  parameters: {
    pop_size: number;
    generations: number;
    crossover_rate: number;
    mutation_rate: number;
    elitism: boolean;
    seed: number;
  };
  problem: {
    items: Items;
    capacity: number;
    n_items: number;
  };
  generations: GenerationData[];
  final_result: {
    best_chromosome: number[];
    selected_items: string[];
    total_weight: number;
    total_value: number;
    fitness: number;
    capacity_used_percentage: number;
    final_population: Individual[];
  };
}

const API_BASE = "http://127.0.0.1:5000";

export default function GeneticAlgorithmPage() {
  // Parameters
  const [popSize, setPopSize] = useState<number>(8);
  const [generations, setGenerations] = useState<number>(8);
  const [crossoverRate, setCrossoverRate] = useState<number>(0.8);
  const [mutationRate, setMutationRate] = useState<number>(0.1);
  const [elitism, setElitism] = useState<boolean>(true);
  const [seed, setSeed] = useState<number>(42);

  // State
  const [result, setResult] = useState<GAResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGeneration, setActiveGeneration] = useState<number>(0);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveGeneration(0);

    try {
      const response = await fetch(`${API_BASE}/api/v1/genetic/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pop_size: popSize,
          generations: generations,
          crossover_rate: crossoverRate,
          mutation_rate: mutationRate,
          elitism: elitism,
          seed: seed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || "Execution failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-8 px-4 text-gray-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Algoritma Genetika - Knapsack Problem
          </h1>
          <p className="text-lg text-gray-600">Tugas 3 - Soft Computing</p>
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
                  min={2}
                  max={100}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 2 - 100</p>
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
                  min={1}
                  max={100}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 1 - 100</p>
              </div>

              {/* Crossover Rate */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probabilitas Crossover: {crossoverRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  value={crossoverRate}
                  onChange={(e) => setCrossoverRate(Number(e.target.value))}
                  className="w-full"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 0.0 - 1.0</p>
              </div>

              {/* Mutation Rate */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probabilitas Mutasi: {mutationRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  value={mutationRate}
                  onChange={(e) => setMutationRate(Number(e.target.value))}
                  className="w-full"
                  min={0}
                  max={1}
                  step={0.05}
                />
                <p className="text-xs text-gray-500 mt-1">Range: 0.0 - 1.0</p>
              </div>

              {/* Elitism */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={elitism}
                    onChange={(e) => setElitism(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Gunakan Elitism
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Pertahankan individu terbaik
                </p>
              </div>

              {/* Random Seed */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Random Seed
                </label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Untuk hasil yang konsisten
                </p>
              </div>

              {/* Run Button */}
              <button
                onClick={handleRun}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "🔄 Memproses..." : "▶️ Jalankan Algoritma"}
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
                📦 Knapsack Problem
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p><strong>A:</strong> Berat: 7 kg, Nilai: $5</p>
                    <p><strong>B:</strong> Berat: 2 kg, Nilai: $4</p>
                    <p><strong>C:</strong> Berat: 1 kg, Nilai: $7</p>
                    <p><strong>D:</strong> Berat: 9 kg, Nilai: $2</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kapasitas:</h3>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-3xl font-bold text-blue-700">15 kg</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Maksimal berat yang dapat dibawa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <>
                {/* Generation Navigator */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    🔄 Navigasi Generasi
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.generations.map((gen, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGeneration(idx)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                          activeGeneration === idx
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {gen.type === "initialization" ? "Init" : `Gen ${gen.generation}`}
                      </button>
                    ))}
                    <button
                      onClick={() => setActiveGeneration(result.generations.length)}
                      className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        activeGeneration === result.generations.length
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Final
                    </button>
                  </div>
                </div>

                {/* Generation Display */}
                {activeGeneration < result.generations.length ? (
                  <GenerationDisplay
                    generation={result.generations[activeGeneration]}
                    problem={result.problem}
                  />
                ) : (
                  <FinalResultDisplay result={result} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for displaying generation details
function GenerationDisplay({ generation, problem }: { generation: GenerationData; problem: any }) {
  const isInitialization = generation.type === "initialization";

  return (
    <div className="space-y-6">
      {/* Generation Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isInitialization ? "🎲 Inisialisasi Populasi" : `🧬 Generasi ${generation.generation}`}
          </h2>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
            Fitness Terbaik: {generation.best_individual.fitness}
          </div>
        </div>

        {/* Statistics */}
        {generation.statistics && (
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded text-center">
              <p className="text-gray-600">Max Fitness</p>
              <p className="text-xl font-bold text-green-700">
                {generation.statistics.max_fitness.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded text-center">
              <p className="text-gray-600">Avg Fitness</p>
              <p className="text-xl font-bold text-blue-700">
                {generation.statistics.avg_fitness.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded text-center">
              <p className="text-gray-600">Min Fitness</p>
              <p className="text-xl font-bold text-orange-700">
                {generation.statistics.min_fitness.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded text-center">
              <p className="text-gray-600">Std Dev</p>
              <p className="text-xl font-bold text-purple-700">
                {generation.statistics.std_fitness.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Best Individual */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">⭐ Individu Terbaik</h3>
        <div className="bg-linear-to-r from-yellow-50 to-green-50 p-4 rounded-lg border-2 border-yellow-300">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Kromosom:</p>
              <p className="font-mono text-lg">[{generation.best_individual.chromosome.join(", ")}]</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Item Terpilih:</p>
              <p className="text-lg font-bold text-green-700">
                {generation.best_individual.items.join(", ") || "None"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Total Berat:</p>
              <p className="text-xl font-bold text-blue-700">
                {generation.best_individual.weight} kg / {problem.capacity} kg
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Total Nilai:</p>
              <p className="text-xl font-bold text-green-700">
                ${generation.best_individual.value}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Population Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          👥 Populasi ({isInitialization ? generation.population?.length : generation.population_before?.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kromosom</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Items</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Berat</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nilai</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Fitness</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(isInitialization ? generation.population : generation.population_before)?.map((ind) => (
                <tr
                  key={ind.index}
                  className={ind.is_best ? "bg-yellow-50 font-bold" : ""}
                >
                  <td className="px-3 py-2 text-sm">{ind.index}</td>
                  <td className="px-3 py-2 text-sm font-mono">[{ind.chromosome.join(",")}]</td>
                  <td className="px-3 py-2 text-sm">{ind.items.join(",") || "-"}</td>
                  <td className="px-3 py-2 text-sm">{ind.weight}</td>
                  <td className="px-3 py-2 text-sm">${ind.value}</td>
                  <td className="px-3 py-2 text-sm font-bold text-green-600">{ind.fitness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operations (only for evolution generations) */}
      {!isInitialization && generation.selection && (
        <>
          {/* Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Seleksi</h3>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm"><strong>Metode:</strong> {generation.selection.method.replace("_", " ").toUpperCase()}</p>
              <p className="text-sm"><strong>Pasangan Terpilih:</strong> {generation.selection.selected_pairs}</p>
              <p className="text-xs text-gray-600 mt-2">
                Individu dipilih berdasarkan probabilitas proporsional terhadap fitness mereka
              </p>
            </div>
          </div>

          {/* Crossover */}
          {generation.crossover && generation.crossover.operations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🔀 Crossover (Rate: {generation.crossover.rate})
              </h3>
              <div className="space-y-3">
                {generation.crossover.operations.map((op, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded ${op.crossed ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                  >
                    <p className="text-xs font-medium mb-2">
                      {op.crossed ? "✓ Crossed" : "✗ Not Crossed"}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <p className="text-gray-600">Parent 1: [{op.parent1.join(",")}]</p>
                        <p className="text-green-600">Child 1: [{op.child1.join(",")}]</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Parent 2: [{op.parent2.join(",")}]</p>
                        <p className="text-green-600">Child 2: [{op.child2.join(",")}]</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mutation */}
          {generation.mutation && generation.mutation.operations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🧬 Mutasi (Rate: {generation.mutation.rate})
              </h3>
              <div className="space-y-2">
                {generation.mutation.operations.map((op, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded ${op.mutated ? "bg-purple-50 border border-purple-200" : "bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-gray-600">Before: </span>
                        <span>[{op.before.join(",")}]</span>
                      </div>
                      <div>
                        {op.mutated ? "➜" : "="}
                      </div>
                      <div>
                        <span className="text-gray-600">After: </span>
                        <span className={op.mutated ? "text-purple-600 font-bold" : ""}>
                          [{op.after.join(",")}]
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Component for displaying final results
function FinalResultDisplay({ result }: { result: GAResult }) {
  return (
    <div className="space-y-6">
      {/* Final Result Header */}
      <div className="bg-linear-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-4 text-center">🏆 HASIL AKHIR</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90">Total Nilai</p>
            <p className="text-3xl font-bold">${result.final_result.total_value}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90">Total Berat</p>
            <p className="text-3xl font-bold">{result.final_result.total_weight} kg</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90">Kapasitas</p>
            <p className="text-3xl font-bold">{result.final_result.capacity_used_percentage.toFixed(0)}%</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90">Fitness</p>
            <p className="text-3xl font-bold">{result.final_result.fitness}</p>
          </div>
        </div>
      </div>

      {/* Best Solution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">✨ Solusi Terbaik</h3>
        <div className="bg-linear-to-br from-yellow-50 to-green-50 p-6 rounded-lg border-2 border-green-300">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Kromosom:</p>
              <p className="font-mono text-2xl font-bold text-gray-800">
                [{result.final_result.best_chromosome.join(", ")}]
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Item Terpilih:</p>
              <p className="text-3xl font-bold text-green-700">
                {result.final_result.selected_items.join(", ")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {result.final_result.selected_items.map((item) => {
                const itemData = result.problem.items[item];
                return (
                  <div key={item} className="bg-white p-3 rounded-lg text-center border-2 border-green-200">
                    <p className="text-2xl font-bold text-gray-800">{item}</p>
                    <p className="text-sm text-gray-600">{itemData.weight} kg</p>
                    <p className="text-sm font-bold text-green-600">${itemData.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Parameters Used */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Parameter yang Digunakan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600">Population Size</p>
            <p className="text-lg font-bold">{result.parameters.pop_size}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600">Generations</p>
            <p className="text-lg font-bold">{result.parameters.generations}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600">Crossover Rate</p>
            <p className="text-lg font-bold">{result.parameters.crossover_rate}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600">Mutation Rate</p>
            <p className="text-lg font-bold">{result.parameters.mutation_rate}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600">Elitism</p>
            <p className="text-lg font-bold">{result.parameters.elitism ? "Yes" : "No"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600">Random Seed</p>
            <p className="text-lg font-bold">{result.parameters.seed}</p>
          </div>
        </div>
      </div>

      {/* Final Population */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">👥 Populasi Akhir</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kromosom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Berat (kg)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai ($)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fitness</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.final_result.final_population.map((ind) => (
                <tr
                  key={ind.index}
                  className={ind.is_best ? "bg-green-50 font-bold" : "hover:bg-gray-50"}
                >
                  <td className="px-4 py-3 text-sm">{ind.index}</td>
                  <td className="px-4 py-3 text-sm font-mono">[{ind.chromosome.join(", ")}]</td>
                  <td className="px-4 py-3 text-sm">{ind.items.join(", ") || "-"}</td>
                  <td className="px-4 py-3 text-sm">{ind.weight}</td>
                  <td className="px-4 py-3 text-sm">${ind.value}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-bold ${ind.is_best ? "text-green-600" : "text-gray-800"}`}>
                      {ind.fitness}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}