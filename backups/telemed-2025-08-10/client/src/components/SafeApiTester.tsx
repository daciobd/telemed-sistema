import React, { useState } from "react";

const SafeApiTester: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/test-demo-safe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || "Erro ao chamar API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Teste da API Segura</h2>
      <button
        onClick={handleTestApi}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Testando..." : "📡 Testar /api/test-demo-safe"}
      </button>

      {response && (
        <pre className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg text-sm overflow-x-auto">
          <span className="text-green-600 font-semibold">✅ Resposta:</span>
          <br />
          {response}
        </pre>
      )}

      {error && (
        <pre className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg text-sm text-red-700">
          <span className="font-semibold">❌ Erro:</span>
          <br />
          {error}
        </pre>
      )}
    </div>
  );
};

export default SafeApiTester;