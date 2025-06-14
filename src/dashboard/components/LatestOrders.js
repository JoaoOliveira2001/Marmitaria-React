import React from "react";

export default function LatestOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const products = String(o["Produto(s)"] || "")
          .split("|")
          .map((p) => p.trim())
          .filter(Boolean);
        const table = o.Mesa || o["Mesa"] || o["Endereço"] || "-";
        return (
          <div key={o.ID} className="bg-white p-4 rounded shadow border">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Mesa {table}</span>
              <span className="text-sm text-gray-600">
                {new Date(o.Data).toLocaleString()}
              </span>
            </div>
            <ul className="text-sm mb-2 space-y-1">
              {products.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <span className="font-bold">Total: R$ {parseFloat(o.Total || 0).toFixed(2)}</span>
              <button
                onClick={() => window.print()}
                className="bg-[#5d3d29] text-white px-3 py-1 rounded"
              >
                Imprimir Recibo
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
