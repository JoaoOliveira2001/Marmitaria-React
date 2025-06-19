import React, { useEffect, useState, useRef } from "react";

const ORDERS_API =
  "https://script.google.com/macros/s/AKfycbx99ZMXtaHbwS_hq_PxrLK4gBRxhDfa_YsHLU0FujJkv52rKkGyXU6jeRJhP9LioL2Y/exec";

function parseItems(order) {
  if (Array.isArray(order.itensFormatados)) {
    return order.itensFormatados.map((it) => ({
      nome: it.nome || it.name,
      qtd: it.qtd || it.quantidade || it.qty || 1,
      obs:
        it.observacoes ||
        it.observacao ||
        it.observation ||
        it.obs ||
        it.observations ||
        "",
    }));
  }
  const produtos = order["Produto(s)"] || "";
  return produtos
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/(.+?) x(\d+)(?: \(Obs: (.+)\))?/i);
      if (m)
        return {
          nome: m[1].trim(),
          qtd: parseInt(m[2], 10),
          obs: m[3] ? m[3].trim() : "",
        };
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
  const [printedOrders, setPrintedOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("printedOrders") || "[]");
    } catch {
      return [];
    }
  });
  const [unseenMap, setUnseenMap] = useState({});
  const prevOrdersRef = useRef([]);

  const orderKey = (o) => `${o.Mesa}_${o.Data}_${o.Total}`;

  const fetchOrders = () => {
    fetch(ORDERS_API)
      .then((res) => res.json())
      .then((data) => {
        const pedidos = data.pedidos || data;
        const valid = pedidos.filter((p) => p.Data);
        valid.sort((a, b) => new Date(b.Data) - new Date(a.Data));
        let stored = [];
        try {
          stored = JSON.parse(localStorage.getItem("printedOrders") || "[]");
        } catch {
          stored = [];
        }
        const printed = new Set(stored.map((p) => orderKey(p)));
        const filtered = valid.filter((o) => !printed.has(orderKey(o)));
        setOrders(filtered);
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos", err);
        setOrders([]);
      });
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "refreshData") {
        fetchOrders();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Detect new orders and mark them as unseen
  useEffect(() => {
    const prev = prevOrdersRef.current;
    const prevKeys = new Set(prev.map((o) => orderKey(o)));
    setUnseenMap((prevMap) => {
      const updated = { ...prevMap };
      orders.forEach((o) => {
        const key = orderKey(o);
        if (!prevKeys.has(key) && !updated[key]) {
          updated[key] = true;
        }
      });
      // remove entries for orders no longer present
      Object.keys(updated).forEach((k) => {
        if (!orders.some((o) => orderKey(o) === k)) {
          delete updated[k];
        }
      });
      return updated;
    });
    prevOrdersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    const checkReset = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem("printedDate");
      if (stored !== today) {
        setPrintedOrders([]);
        localStorage.setItem("printedDate", today);
        localStorage.setItem("printedOrders", "[]");
      }
    };
    checkReset();
    const id = setInterval(checkReset, 60000);
    return () => clearInterval(id);
  }, []);

  const printOrder = (order) => {
    const items = parseItems(order);
    const win = window.open("", "_blank");
    const html = `<!DOCTYPE html>
<html>
<head>
<title>COMANDA - Mesa ${order.Mesa}</title>
<style>
  body { font-family: sans-serif; padding: 20px; }
  h1 { text-align: center; font-size: 20px; }
  ul { list-style: none; padding: 0; }
  li { margin: 4px 0; }
  .total { font-weight: bold; margin-top: 10px; font-size: 16px; }
</style>
</head>
<body>
<h1>COMANDA - Mesa ${order.Mesa}</h1>
<p>${formatTime(order.Data)}</p>
<ul>
${items
  .map(
    (it) =>
      `<li>${it.nome} x${it.qtd}${it.obs ? `<br><small>Obs: ${it.obs}</small>` : ""}</li>`
  )
  .join("")}
</ul>
<p class="total">Total: R$ ${order.Total}</p>
<script>window.print();</script>
</body>
</html>`;
    win.document.write(html);
    win.document.close();
    markAsSeen(order);
    setPrintedOrders((prev) => {
      const updated = [...prev, order];
      localStorage.setItem("printedOrders", JSON.stringify(updated));
      return updated;
    });
    setOrders((prev) => prev.filter((o) => orderKey(o) !== orderKey(order)));
  };

  const markAsSeen = (order) => {
    const key = orderKey(order);
    setUnseenMap((prev) => ({ ...prev, [key]: false }));
  };

  const hasOrders = orders.length > 0;

  return (
    <div className="space-y-4">
      {hasOrders ? orders.map((o, idx) => {
        const items = parseItems(o);
        const key = orderKey(o);
        const highlight = unseenMap[key];
        return (
          <div
            key={idx}
            onClick={() => markAsSeen(o)}
            className={`bg-white p-4 rounded shadow ${highlight ? "animate-pulse" : ""}`}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-bold">Mesa {o.Mesa}</div>
                <div className="text-sm text-gray-500">{formatTime(o.Data)}</div>
              </div>
              <div className="font-bold">R$ {parseFloat(o.Total).toFixed(2)}</div>
            </div>
            <ul className="mt-2">
              {items.map((it, i) => (
                <React.Fragment key={i}>
                  <li className="flex justify-between">
                    <span>{it.nome}</span>
                    <span>x{it.qtd}</span>
                  </li>
                  {it.obs && (
                    <li className="text-xs text-gray-500 italic ml-2">Obs: {it.obs}</li>
                  )}
                </React.Fragment>
              ))}
            </ul>
            <button
              onClick={() => printOrder(o)}
              className="mt-2 bg-[#5d3d29] text-[#fff4e4] px-2 py-1 rounded"
            >
              Imprimir Comanda
            </button>
          </div>
        );
      }) : <p className="text-center">Nenhum pedido</p>}

      {printedOrders.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold mb-2">Pedidos Impressos</h3>
          <div className="space-y-4">
            {printedOrders.map((o, idx) => {
              const items = parseItems(o);
              return (
                <div key={idx} className="bg-gray-100 p-4 rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">Mesa {o.Mesa}</div>
                      <div className="text-sm text-gray-500">{formatTime(o.Data)}</div>
                    </div>
                    <div className="font-bold">R$ {parseFloat(o.Total).toFixed(2)}</div>
                  </div>
                  <ul className="mt-2">
                    {items.map((it, i) => (
                      <React.Fragment key={i}>
                        <li className="flex justify-between">
                          <span>{it.nome}</span>
                          <span>x{it.qtd}</span>
                        </li>
                        {it.obs && (
                          <li className="text-xs text-gray-500 italic ml-2">
                            Obs: {it.obs}
                          </li>
                        )}
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
