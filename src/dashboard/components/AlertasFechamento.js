import React from "react";

export default function AlertasFechamento({ mesas, onAtender, loading, error }) {
  if (!mesas || mesas.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 m-4 w-72 space-y-2 z-50">
      {mesas.map((m) => (
        <div
          key={m}
          className="bg-red-100 border border-red-500 text-[#5d3d29] p-3 rounded shadow flex justify-between items-center"
        >
          <span className="font-medium">Mesa {m} pediu conta</span>
          <div className="flex flex-col items-end">
            <button
              onClick={() => onAtender(m)}
              disabled={loading}
              className="text-sm text-red-700 hover:underline disabled:opacity-50"
            >
              {loading ? "Aguarde..." : "✔ Atendido"}
            </button>
            {error && <span className="text-xs text-red-500">Erro</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
