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

  const closeOrder = (index) => {
    const updated = [...orders];
    const [removed] = updated.splice(index, 1);
    setOrders(updated);
    localStorage.setItem("dashboard_orders", JSON.stringify(updated));
    const occ = JSON.parse(localStorage.getItem("occupied_tables") || "[]");
    const idx = occ.indexOf(removed.mesa);
    if (idx >= 0) {
      occ.splice(idx, 1);
      localStorage.setItem("occupied_tables", JSON.stringify(occ));
    }
  };

  return (
    <div className="min-h-screen bg-[#fff4e4] p-4">
      <h2 className="text-2xl font-bold mb-4">Cozinha - Novos Pedidos</h2>
      {orders.length === 0 && <p>Nenhum pedido.</p>}
      {orders.map((order, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow mb-4">
          <div className="font-semibold">
            Mesa {order.mesa} - {new Date(order.hora).toLocaleTimeString()}
          </div>
          <div className="text-sm mb-2">{order.itens}</div>
          <div className="mb-2">Total R$ {order.total}</div>
          <div className="font-bold mb-2">Status: {order.status}</div>
          <button
            onClick={() => closeOrder(idx)}
            className="bg-[#5d3d29] text-white px-3 py-1 rounded"
          >
            Fechar Pedido
          </button>
        </div>
      ))}
    </div>
  );
}
