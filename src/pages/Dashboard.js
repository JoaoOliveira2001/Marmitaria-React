import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPedidos from "../components/LoginPedidos";
import MesasMenu from "../dashboard/components/MesasMenu";
import OrdersList from "../dashboard/Orders";
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

const API_URL =
  "https://script.google.com/macros/s/AKfycbwHrRUQZIWj8edBBQA-2tBA6J-mIVTypi5w5BFfBULIb5G1vpposGqQ2I3l-b3tjTO_/exec";

const MESAS_API =
  "https://script.google.com/macros/s/AKfycbzcncEtTmtS7DrJdfN5dTAaQbNr02ha_Psql6vdlbjOI8gJEM5ioayiKMpRwUxzzHd_/exec";

const Dashboard = () => {
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");
  const [checkoutRequests, setCheckoutRequests] = useState([]);

  const fetchCheckoutRequests = () => {
    fetch(MESAS_API)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.mesas)) {
          const req = data.mesas
            .filter((m) => {
              const status = String(m.status || "").toLowerCase().trim();
              return status === "fechar conta";
            })
            .map((m) => String(m.mesa ?? m.numero ?? m.id ?? m));
          setCheckoutRequests(req);
        } else {
          setCheckoutRequests([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar mesas", err);
        setCheckoutRequests([]);
      });
  };

  const clearCheckoutRequest = async (mesa) => {
    try {
      await fetch("/api/limpaMesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesa: String(mesa) }),
      });
    } catch (err) {
      console.error("Erro ao liberar mesa", err);
    }
    setCheckoutRequests((prev) => prev.filter((m) => m !== mesa));
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Falha ao buscar API", err));
  }, []);

  useEffect(() => {
    fetchCheckoutRequests();
    const id = setInterval(fetchCheckoutRequests, 60000);
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
              <button
                onClick={() => clearCheckoutRequest(m)}
                className="text-sm text-red-700 hover:underline"
              >
                ✔ Atendido – Liberar Mesa
              </button>
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
