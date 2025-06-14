import React, { useEffect, useState } from "react";

const ORDERS_API = "https://script.google.com/macros/s/AKfycbx99ZMXtaHbwS_hq_PxrLK4gBRxhDfa_YsHLU0FujJkv52rKkGyXU6jeRJhP9LioL2Y/exec";

function parseItems(order) {
  if (Array.isArray(order.itensFormatados)) {
    return order.itensFormatados.map((it) => ({ nome: it.nome || it.name, qtd: it.qtd || it.quantidade || it.qty || 1 }));
  }
  const produtos = order["Produto(s)"] || "";
  return produtos
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/(.+?) x(\d+)/i);
      if (m) return { nome: m[1].trim(), qtd: parseInt(m[2], 10) };
      return { nome: p, qtd: 1 };
    });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch(ORDERS_API)
      .then((res) => res.json())
      .then((data) => {
        const pedidos = data.pedidos || data;
        const valid = pedidos.filter((p) => p.Data);
        valid.sort((a, b) => new Date(b.Data) - new Date(a.Data));
        setOrders(valid);
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos", err);
        setOrders([]);
      });
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 60000);
    return () => clearInterval(id);
  }, []);

  const printOrder = (order) => {
    const items = parseItems(order);
    const win = window.open("", "_blank");
    const html = `<!DOCTYPE html>
<html>
<head>
<title>RECEIPT - Mesa ${order.Mesa}</title>
<style>
  body { font-family: sans-serif; padding: 20px; }
  h1 { text-align: center; font-size: 20px; }
  ul { list-style: none; padding: 0; }
  li { margin: 4px 0; }
  .total { font-weight: bold; margin-top: 10px; font-size: 16px; }
</style>
</head>
<body>
<h1>RECEIPT - Mesa ${order.Mesa}</h1>
<p>${formatTime(order.Data)}</p>
<ul>
${items.map((it) => `<li>${it.nome} x${it.qtd}</li>`).join("")}
</ul>
<p class="total">Total: R$ ${order.Total}</p>
<script>window.print();</script>
</body>
</html>`;
    win.document.write(html);
    win.document.close();
  };

  if (orders.length === 0) {
    return <p className="text-center mt-4">No orders yet</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((o, idx) => {
        const items = parseItems(o);
        return (
          <div key={idx} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-bold">Mesa {o.Mesa}</div>
                <div className="text-sm text-gray-500">{formatTime(o.Data)}</div>
              </div>
              <div className="font-bold">R$ {parseFloat(o.Total).toFixed(2)}</div>
            </div>
            <ul className="mt-2">
              {items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>{it.nome}</span>
                  <span>x{it.qtd}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => printOrder(o)}
              className="mt-2 bg-[#5d3d29] text-[#fff4e4] px-2 py-1 rounded"
            >
              Print Receipt
            </button>
          </div>
        );
      })}
    </div>
  );
}
