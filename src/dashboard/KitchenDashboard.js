import React, { useEffect, useState } from "react";

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);

  const load = () => {
    const stored = JSON.parse(localStorage.getItem("dashboard_orders") || "[]");
    setOrders(stored);
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const closeTable = (mesa) => {
    const updated = orders.filter((o) => o.mesa !== mesa);
    setOrders(updated);
    localStorage.setItem("dashboard_orders", JSON.stringify(updated));
    const occ = JSON.parse(localStorage.getItem("occupied_tables") || "[]");
    const idx = occ.indexOf(mesa);
    if (idx >= 0) {
      occ.splice(idx, 1);
      localStorage.setItem("occupied_tables", JSON.stringify(occ));
    }
  };

  return (
    <div className="min-h-screen bg-[#fff4e4] p-4">
      <h2 className="text-2xl font-bold mb-4">Cozinha - Novos Pedidos</h2>
      {orders.length === 0 && <p>Nenhum pedido.</p>}
      {Object.entries(
        orders.reduce((acc, o) => {
          acc[o.mesa] = acc[o.mesa] ? [...acc[o.mesa], o] : [o];
          return acc;
        }, {})
      ).map(([mesa, list]) => (
        <div key={mesa} className="bg-white p-4 rounded shadow mb-4">
          <div className="font-semibold mb-2">Mesa {mesa}</div>
          {list.map((order, idx) => (
            <div key={idx} className="text-sm mb-1">
              {new Date(order.hora).toLocaleTimeString()} - {order.itens} (R$
              {order.total})
            </div>
          ))}
          <button
            onClick={() => closeTable(mesa)}
            className="mt-2 bg-[#5d3d29] text-white px-3 py-1 rounded"
          >
            Fechar Mesa
          </button>
        </div>
      ))}
    </div>
  );
}
