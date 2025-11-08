"use client";

import { useState } from "react";

interface SugenoResult {
  input: { demand: number; inventory: number };
  fuzzification: {
    demand: { TURUN: number; NAIK: number };
    inventory: { SEDIKIT: number; BANYAK: number };
  };
  rule_evaluations: Array<{
    rule_id: number;
    firing_strength: number;
    z_output: number;
    description: string;
  }>;
  defuzzification: {
    numerator: number;
    denominator: number;
    result: number;
  };
  output: { production: number; unit: string };
}

export default function FuzzySugenoPage() {
  const [demand, setDemand] = useState<number>(4000);
  const [inventory, setInventory] = useState<number>(300);
  const [result, setResult] = useState<SugenoResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/sugeno/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demand,
          inventory,
          demand_range: [1000, 5000],
          inventory_range: [100, 600],
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

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-8 px-4 text-gray-500 ">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fuzzy Sugeno Production System
          </h1>
          <p className="text-gray-600">Tugas 2 - Soft Computing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Input Parameter</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permintaan (Demand)
              </label>
              <input
                type="number"
                value={demand}
                onChange={(e) => setDemand(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Persediaan (Inventory)
              </label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500"
              />
            </div>

            <button
              onClick={handleCompute}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menghitung..." : "Hitung Produksi"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg text-black shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Metode Sugeno</h2>
            <div className="text-sm space-y-2">
              <p><strong>Rule 1:</strong> IF demand TURUN AND inventory BANYAK THEN z1 = demand - inventory</p>
              <p><strong>Rule 2:</strong> IF demand TURUN AND inventory SEDIKIT THEN z2 = demand</p>
              <p><strong>Rule 3:</strong> IF demand NAIK AND inventory BANYAK THEN z3 = demand</p>
              <p><strong>Rule 4:</strong> IF demand NAIK AND inventory SEDIKIT THEN z4 = 1.25  demand - inventory</p>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p><strong>Defuzzifikasi:</strong> Weighted Average</p>
                <p className="font-mono">z* = (Σ(αi  zi)) / (Σ αi)</p>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">1. Fuzzifikasi</h2>
              <p className="text-sm text-gray-600 mb-4">
                Konversi nilai crisp menjadi derajat keanggotaan fuzzy menggunakan fungsi keanggotaan triangular.
              </p>
              
              {/* Input Values Display */}
              <div className="bg-yellow-50 p-4 rounded-lg mb-6 border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-800 mb-2">Nilai Input:</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">PERMINTAAN (x):</span>
                    <p className="font-bold text-lg">{result.input.demand}</p>
                    <p className="text-xs text-gray-500">Range: 1000 - 5000</p>
                  </div>
                  <div>
                    <span className="text-gray-600">PERSEDIAAN (y):</span>
                    <p className="font-bold text-lg">{result.input.inventory}</p>
                    <p className="text-xs text-gray-500">Range: 100 - 600</p>
                  </div>
                  <div>
                    <span className="text-gray-600">PRODUKSI (z):</span>
                    <p className="font-bold text-lg text-green-600">?</p>
                    <p className="text-xs text-gray-500">Range: 2000 - 7000</p>
                  </div>
                </div>
              </div>

              {/* Membership Function Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demand Fuzzification */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    PERMINTAAN - 2 Himpunan Fuzzy: TURUN dan NAIK
                  </h3>
                  
                  {/* Demand Membership Functions */}
                  <div className="bg-white p-3 rounded mb-3 text-xs">
                    <p className="font-mono mb-2">μ<sub>pmtTURUN</sub>[x] = {'{'}</p>
                    <div className="ml-4 space-y-1">
                      <p>1, x &lt; 1000</p>
                      <p>(5000 - x)/4000, 1000 ≤ x ≤ 5000</p>
                      <p>0, x &gt; 5000</p>
                    </div>
                    <p className="font-mono mt-2">μ<sub>pmtNAIK</sub>[x] = {'{'}</p>
                    <div className="ml-4 space-y-1">
                      <p>0, x &lt; 1000</p>
                      <p>(x - 1000)/4000, 1000 ≤ x ≤ 5000</p>
                      <p>1, x &gt; 5000</p>
                    </div>
                  </div>

                  {/* Demand Calculations */}
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-semibold mb-2">Perhitungan untuk x = {result.input.demand}:</p>
                    <div className="space-y-2">
                      <div>
                        <p>μ<sub>pmtTURUN</sub>[{result.input.demand}] = (5000 - {result.input.demand})/4000</p>
                        <p className="ml-4 font-bold text-red-600">= {result.fuzzification.demand.TURUN.toFixed(4)}</p>
                      </div>
                      <div>
                        <p>μ<sub>pmtNAIK</sub>[{result.input.demand}] = ({result.input.demand} - 1000)/4000</p>
                        <p className="ml-4 font-bold text-green-600">= {result.fuzzification.demand.NAIK.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory Fuzzification */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    PERSEDIAAN - 2 Himpunan Fuzzy: SEDIKIT dan BANYAK
                  </h3>
                  
                  {/* Inventory Membership Functions */}
                  <div className="bg-white p-3 rounded mb-3 text-xs">
                    <p className="font-mono mb-2">μ<sub>psdSEDIKIT</sub>[y] = {'{'}</p>
                    <div className="ml-4 space-y-1">
                      <p>1, y &lt; 100</p>
                      <p>(600 - y)/500, 100 ≤ y ≤ 600</p>
                      <p>0, y &gt; 600</p>
                    </div>
                    <p className="font-mono mt-2">μ<sub>psdBANYAK</sub>[y] = {'{'}</p>
                    <div className="ml-4 space-y-1">
                      <p>0, y &lt; 100</p>
                      <p>(y - 100)/500, 100 ≤ y ≤ 600</p>
                      <p>1, y &gt; 600</p>
                    </div>
                  </div>

                  {/* Inventory Calculations */}
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-semibold mb-2">Perhitungan untuk y = {result.input.inventory}:</p>
                    <div className="space-y-2">
                      <div>
                        <p>μ<sub>psdSEDIKIT</sub>[{result.input.inventory}] = (600 - {result.input.inventory})/500</p>
                        <p className="ml-4 font-bold text-orange-600">= {result.fuzzification.inventory.SEDIKIT.toFixed(4)}</p>
                      </div>
                      <div>
                        <p>μ<sub>psdBANYAK</sub>[{result.input.inventory}] = ({result.input.inventory} - 100)/500</p>
                        <p className="ml-4 font-bold text-blue-600">= {result.fuzzification.inventory.BANYAK.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">2. Evaluasi Aturan (Rule Evaluation)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Menghitung firing strength (α) menggunakan operator AND = MIN dan output fungsi linear Sugeno.
              </p>
              
              {/* Rules Overview */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-800 mb-3">4 Aturan Fuzzy Sugeno:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded">
                    <p><strong>Rule 1:</strong> IF demand TURUN AND inventory BANYAK</p>
                    <p className="text-blue-600 font-mono">THEN z₁ = demand - inventory</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p><strong>Rule 2:</strong> IF demand TURUN AND inventory SEDIKIT</p>
                    <p className="text-blue-600 font-mono">THEN z₂ = demand</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p><strong>Rule 3:</strong> IF demand NAIK AND inventory BANYAK</p>
                    <p className="text-blue-600 font-mono">THEN z₃ = demand</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p><strong>Rule 4:</strong> IF demand NAIK AND inventory SEDIKIT</p>
                    <p className="text-blue-600 font-mono">THEN z₄ = 1.25 × demand - inventory</p>
                  </div>
                </div>
              </div>

              {/* Detailed Rule Evaluations */}
              <div className="space-y-4">
                {result.rule_evaluations.map((rule) => (
                  <div key={rule.rule_id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">Aturan {rule.rule_id}</h3>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        α₁ = {rule.firing_strength.toFixed(4)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 italic">{rule.description}</p>
                    
                    {/* Antecedent Calculation */}
                    <div className="bg-white p-3 rounded mb-3">
                      <h4 className="font-medium text-gray-800 mb-2">Antecedent (Premise):</h4>
                      <div className="text-sm space-y-1">
                        {rule.rule_id === 1 && (
                          <>
                            <p>μ<sub>pmtTURUN</sub>[{result.input.demand}] = {result.fuzzification.demand.TURUN.toFixed(4)}</p>
                            <p>μ<sub>psdBANYAK</sub>[{result.input.inventory}] = {result.fuzzification.inventory.BANYAK.toFixed(4)}</p>
                            <p className="font-bold text-blue-600">
                              α₁ = MIN({result.fuzzification.demand.TURUN.toFixed(4)}, {result.fuzzification.inventory.BANYAK.toFixed(4)}) = {rule.firing_strength.toFixed(4)}
                            </p>
                          </>
                        )}
                        {rule.rule_id === 2 && (
                          <>
                            <p>μ<sub>pmtTURUN</sub>[{result.input.demand}] = {result.fuzzification.demand.TURUN.toFixed(4)}</p>
                            <p>μ<sub>psdSEDIKIT</sub>[{result.input.inventory}] = {result.fuzzification.inventory.SEDIKIT.toFixed(4)}</p>
                            <p className="font-bold text-blue-600">
                              α₂ = MIN({result.fuzzification.demand.TURUN.toFixed(4)}, {result.fuzzification.inventory.SEDIKIT.toFixed(4)}) = {rule.firing_strength.toFixed(4)}
                            </p>
                          </>
                        )}
                        {rule.rule_id === 3 && (
                          <>
                            <p>μ<sub>pmtNAIK</sub>[{result.input.demand}] = {result.fuzzification.demand.NAIK.toFixed(4)}</p>
                            <p>μ<sub>psdBANYAK</sub>[{result.input.inventory}] = {result.fuzzification.inventory.BANYAK.toFixed(4)}</p>
                            <p className="font-bold text-blue-600">
                              α₃ = MIN({result.fuzzification.demand.NAIK.toFixed(4)}, {result.fuzzification.inventory.BANYAK.toFixed(4)}) = {rule.firing_strength.toFixed(4)}
                            </p>
                          </>
                        )}
                        {rule.rule_id === 4 && (
                          <>
                            <p>μ<sub>pmtNAIK</sub>[{result.input.demand}] = {result.fuzzification.demand.NAIK.toFixed(4)}</p>
                            <p>μ<sub>psdSEDIKIT</sub>[{result.input.inventory}] = {result.fuzzification.inventory.SEDIKIT.toFixed(4)}</p>
                            <p className="font-bold text-blue-600">
                              α₄ = MIN({result.fuzzification.demand.NAIK.toFixed(4)}, {result.fuzzification.inventory.SEDIKIT.toFixed(4)}) = {rule.firing_strength.toFixed(4)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Consequent Calculation */}
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-gray-800 mb-2">Consequent (Output):</h4>
                      <div className="text-sm">
                        {rule.rule_id === 1 && (
                          <p>z₁ = {result.input.demand} - {result.input.inventory} = <span className="font-bold text-green-600">{rule.z_output.toFixed(2)}</span></p>
                        )}
                        {rule.rule_id === 2 && (
                          <p>z₂ = {result.input.demand} = <span className="font-bold text-green-600">{rule.z_output.toFixed(2)}</span></p>
                        )}
                        {rule.rule_id === 3 && (
                          <p>z₃ = {result.input.demand} = <span className="font-bold text-green-600">{rule.z_output.toFixed(2)}</span></p>
                        )}
                        {rule.rule_id === 4 && (
                          <p>z₄ = 1.25 × {result.input.demand} - {result.input.inventory} = <span className="font-bold text-green-600">{rule.z_output.toFixed(2)}</span></p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">3. Defuzzifikasi (Weighted Average)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Menghitung output crisp menggunakan metode rata-rata terbobot (weighted average) dari semua aturan yang aktif.
              </p>

              {/* Formula Display */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-800 mb-2">Formula Weighted Average:</h3>
                <div className="text-center text-lg font-mono font-bold text-blue-800">
                  z* = (Σ αᵢ × zᵢ) / (Σ αᵢ)
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  dimana αᵢ = firing strength dan zᵢ = output aturan ke-i
                </p>
              </div>

              {/* Detailed Calculation */}
              <div className="space-y-4">
                {/* Numerator Calculation */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Perhitungan Numerator (Σ αᵢ × zᵢ):</h4>
                  <div className="space-y-2 text-sm">
                    {result.rule_evaluations.map((rule) => (
                      <div key={rule.rule_id} className="flex justify-between items-center bg-white p-2 rounded">
                        <span>α₁ × z₁ = {rule.firing_strength.toFixed(4)} × {rule.z_output.toFixed(2)}</span>
                        <span className="font-bold text-yellow-700">
                          = {(rule.firing_strength * rule.z_output).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between items-center font-bold text-yellow-800">
                        <span>Total Numerator:</span>
                        <span className="text-lg">{result.defuzzification.numerator.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Denominator Calculation */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Perhitungan Denominator (Σ αᵢ):</h4>
                  <div className="text-sm">
                    <div className="bg-white p-2 rounded mb-2">
                      <span>
                        Σ αᵢ = {result.rule_evaluations.map(rule => rule.firing_strength.toFixed(4)).join(' + ')} = 
                        <span className="font-bold text-purple-700 ml-2">{result.defuzzification.denominator.toFixed(4)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Result */}
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
                  <h4 className="font-semibold text-gray-800 mb-3 text-center">Hasil Akhir:</h4>
                  <div className="text-center space-y-3">
                    <div className="text-lg">
                      <span className="font-mono">z* = </span>
                      <span className="font-mono text-yellow-700">{result.defuzzification.numerator.toFixed(2)}</span>
                      <span className="font-mono"> / </span>
                      <span className="font-mono text-purple-700">{result.defuzzification.denominator.toFixed(4)}</span>
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                      z* = {result.defuzzification.result.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Nilai produksi optimal berdasarkan sistem fuzzy Sugeno
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">4. Hasil Akhir - Rekomendasi Produksi</h2>
              
              {/* Summary of Process */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Ringkasan Proses:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-100 p-3 rounded text-center">
                    <p className="font-semibold text-blue-800">1. Fuzzifikasi</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Konversi nilai crisp → fuzzy
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded text-center">
                    <p className="font-semibold text-yellow-800">2. Evaluasi Aturan</p>
                    <p className="text-xs text-gray-600 mt-1">
                      4 aturan Sugeno + firing strength
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded text-center">
                    <p className="font-semibold text-green-800">3. Defuzzifikasi</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Weighted average → hasil crisp
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Result Display */}
              <div className="bg-linear-to-br from-green-100 via-blue-100 to-purple-100 p-8 rounded-xl text-center border-2 border-green-300">
                <div className="mb-4">
                  <p className="text-lg text-gray-700 mb-2">🎯 Rekomendasi Produksi Optimal</p>
                  <div className="text-6xl font-bold text-green-700 mb-2">
                    {result.output.production.toFixed(2)}
                  </div>
                  <p className="text-2xl text-gray-600 font-medium">{result.output.unit}</p>
                </div>
                
                {/* Input-Output Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/80 p-4 rounded-lg">
                    <p className="text-gray-600 font-medium">INPUT</p>
                    <p className="text-gray-800">Permintaan</p>
                    <p className="text-2xl font-bold text-blue-700">{result.input.demand}</p>
                    <p className="text-xs text-gray-500">kemasan/hari</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <p className="text-gray-600 font-medium">INPUT</p>
                    <p className="text-gray-800">Persediaan</p>
                    <p className="text-2xl font-bold text-orange-700">{result.input.inventory}</p>
                    <p className="text-xs text-gray-500">kemasan</p>
                  </div>
                  <div className="bg-white/90 p-4 rounded-lg border-2 border-green-400">
                    <p className="text-gray-600 font-medium">OUTPUT</p>
                    <p className="text-gray-800">Produksi</p>
                    <p className="text-2xl font-bold text-green-700">{result.output.production.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">kemasan/hari</p>
                  </div>
                </div>

                {/* Method Info */}
                <div className="mt-6 text-sm text-gray-600">
                  <p className="font-medium">Metode: Fuzzy Inference System (FIS) - Sugeno</p>
                  <p>Defuzzifikasi: Weighted Average Method</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
