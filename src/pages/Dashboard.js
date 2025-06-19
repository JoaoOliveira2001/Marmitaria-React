import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPedidos from "../components/LoginPedidos";
import MesasMenu from "../dashboard/components/MesasMenu";
import OrdersList from "../dashboard/Orders";
import { liberarMesa } from "../utils/gsActions";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Endpoint centralizado no Apps Script
const API_URL =
  "https://script.google.com/macros/s/AKfycbxIcGhc0fURMzbTv5sRf5uNyQ7iLKcQ_D7JTYCyfwCY-QWGf8T3FeuJLe0KwnkJtVuH/exec?acao=buscarPedidos";

const Dashboard = () => {
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");
  const [checkoutRequests, setCheckoutRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("checkoutRequests") || "[]");
    } catch {
      return [];
    }
  });
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeError, setFreeError] = useState(null);

  const fetchFecharContaPedidos = async () => {
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycby4EkTXdD3-3_N-caEaaEUitz3nbgKe3X5lUJTJ2TwFeM-hChHUe1CIIvy_7x7m9Tmd/exec",
        { cache: "no-cache" }
      );
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      const mesas = Array.isArray(data.pedidos)
        ? data.pedidos
            .filter((p) => p.status === "Pendente")
            .map((p) => String(p.Mesa))
        : [];
      const value = JSON.stringify(mesas);
      localStorage.setItem("checkoutRequests", value);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "checkoutRequests", newValue: value })
      );
      setCheckoutRequests(mesas);
    } catch (err) {
      console.error("Falha ao buscar pedidos de fechamento", err);
    }
  };

  const clearCheckoutRequest = async (mesa) => {
    setFreeLoading(true);
    setFreeError(null);
    try {
      const resp = await liberarMesa(String(mesa));
      if (!resp || resp.success !== true) {
        throw new Error('Falha na liberacao');
      }
      setCheckoutRequests((prev) => {
        const updated = prev.filter((m) => m !== mesa);
        const value = JSON.stringify(updated);
        localStorage.setItem("checkoutRequests", value);
        window.dispatchEvent(
          new StorageEvent("storage", { key: "checkoutRequests", newValue: value })
        );
        return updated;
      });
    } catch (err) {
      console.error("Erro ao liberar mesa", err);
      setFreeError(err);
    } finally {
      setFreeLoading(false);
    }
  };

  useEffect(() => {
    fetch(API_URL, { cache: "no-cache" })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Falha ao buscar API", err));
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "checkoutRequests") {
        try {
          setCheckoutRequests(JSON.parse(e.newValue || "[]"));
        } catch {
          setCheckoutRequests([]);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    fetchFecharContaPedidos();
    const id = setInterval(fetchFecharContaPedidos, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const autorizadoLocal = localStorage.getItem("autorizado");
    setAutorizado(autorizadoLocal === "true");
  }, []);

  if (!autorizado) {
    return <LoginPedidos onLogin={() => setAutorizado(true)} />;
  }

  const now = new Date();
  const parseDate = (d) => new Date(d);
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  const withinDays = (dateStr, days) => {
    const date = parseDate(dateStr);
    const diff = now - date;
    return diff <= days * 24 * 60 * 60 * 1000 && diff >= 0;
  };

  const filterOrder = (order) => {
    const d = parseDate(order.Data);
    if (filter === "today") return isSameDay(d, now);
    if (filter === "week") return withinDays(order.Data, 7);
    if (filter === "month") return withinDays(order.Data, 30);
    return true;
  };

  const filtered = orders.filter(filterOrder);

  const sumBy = (list, key) =>
    list.reduce((sum, o) => sum + parseFloat(o[key] || 0), 0);

  const revenueToday = sumBy(
    orders.filter((o) => isSameDay(parseDate(o.Data), now)),
    "Total"
  );
  const revenueWeek = sumBy(orders.filter((o) => withinDays(o.Data, 7)), "Total");
  const revenueMonth = sumBy(orders.filter((o) => withinDays(o.Data, 30)), "Total");

  const formatCurrency = (v) =>
    Number(v).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalRevenue = sumBy(filtered, "Total");
  const totalOrders = filtered.length;
  const avgQuantity =
    totalOrders > 0
      ? filtered.reduce((s, o) => s + Number(o["Quantidade"] || 0), 0) /
        totalOrders
      : 0;

  const paymentCounts = {};
  filtered.forEach((o) => {
    const p = o.Pagamento;
    if (!p) return;
    paymentCounts[p] = (paymentCounts[p] || 0) + 1;
  });
  const mostPayment =
    Object.entries(paymentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const customerCounts = {};
  filtered.forEach((o) => {
    const phone = String(o.Telefone);
    if (!customerCounts[phone]) customerCounts[phone] = { count: 0, name: o.Nome };
    customerCounts[phone].count += 1;
  });
  const topCustomerEntry = Object.entries(customerCounts).sort(
    (a, b) => b[1].count - a[1].count
  )[0];
  const topCustomer = topCustomerEntry
    ? `${topCustomerEntry[1].name} (${topCustomerEntry[0]})`
    : "-";

  const productCounts = {};
  filtered.forEach((o) => {
    const list = String(o["Produto(s)"]).split("|");
    list.forEach((p) => {
      const m = p.trim().match(/(.+?) x(\d+)/i);
      if (m) {
        const name = m[1].trim();
        const qty = parseInt(m[2]);
        productCounts[name] = (productCounts[name] || 0) + qty;
      } else {
        const name = p.trim();
        if (!name) return;
        productCounts[name] = (productCounts[name] || 0) + 1;
      }
    });
  });
  const topProductEntries = Object.entries(productCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const lineLabels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  const dailyCounts = new Array(daysInMonth).fill(0);
  orders.forEach((o) => {
    const d = parseDate(o.Data);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      dailyCounts[d.getDate() - 1] += 1;
    }
  });
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        data: dailyCounts,
        borderColor: "#5d3d29",
        backgroundColor: "#fff4e4",
        fill: false,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const filterLabel =
    filter === "today" ? "Hoje" : filter === "week" ? "Semana" : "Mês";

  return (
    <div className="min-h-screen bg-[#fff4e4]">
      <MesasMenu />
      {checkoutRequests.length > 0 && (
        <div className="fixed top-0 right-0 m-4 w-64 bg-red-100 border border-red-500 text-[#5d3d29] p-4 space-y-2 z-50">
          {checkoutRequests.map((m) => (
            <div key={m} className="flex justify-between items-center">
              <p>Mesa {m} solicitou fechar a conta.</p>
              <div className="flex flex-col items-end">
                <button
                  onClick={() => clearCheckoutRequest(m)}
                  disabled={freeLoading}
                  className="text-sm text-red-700 hover:underline disabled:opacity-50"
                >
                  {freeLoading ? 'Aguarde...' : '✔ Atendido – Liberar Mesa'}
                </button>
                {freeError && (
                  <span className="text-xs text-red-500">Erro ao liberar</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="ml-48 md:ml-60">
      <header className="bg-[#5d3d29] text-[#fff4e4] py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-[#fff4e4] text-[#5d3d29] px-4 py-2 rounded"
          >
            Início
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6 space-x-2">
          {[
            ["today", "Hoje"],
            ["week", "Semana"],
            ["month", "Mês"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`border px-3 py-1 rounded-full ${
                filter === val
                  ? "bg-[#5d3d29] text-[#fff4e4]"
                  : "bg-white text-[#5d3d29]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-2xl font-bold text-[#5d3d29]">
              R$ {formatCurrency(revenueToday)}
            </div>
            <div className="text-sm text-gray-500">Faturamento Hoje</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-2xl font-bold text-[#5d3d29]">
              R$ {formatCurrency(revenueWeek)}
            </div>
            <div className="text-sm text-gray-500">Últimos 7 dias</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-2xl font-bold text-[#5d3d29]">
              R$ {formatCurrency(revenueMonth)}
            </div>
            <div className="text-sm text-gray-500">Últimos 30 dias</div>
          </div>
        </div>
        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded shadow space-y-2">
            <h2 className="font-bold text-[#5d3d29] text-lg mb-2">
              Resumo ({filterLabel})
            </h2>
            <p>Total de pedidos: {totalOrders}</p>
            <p>Faturamento: R$ {formatCurrency(totalRevenue)}</p>
            <div>
              Mais Vendidos:
              {topProductEntries.length > 0 ? (
                <ul className="list-disc ml-5">
                  {topProductEntries.map(([name, qty]) => (
                    <li key={name}>{name} (x{qty})</li>
                  ))}
                </ul>
              ) : (
                <p>Sem vendas hoje</p>
              )}
            </div>
            <p>Quantidade média: {avgQuantity.toFixed(2)}</p>
            <p>Pagamento mais usado: {mostPayment}</p>
            <p>Cliente com mais pedidos: {topCustomer}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <hr className="my-6" />
        <OrdersList />
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
