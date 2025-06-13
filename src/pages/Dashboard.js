import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPedidos from "../components/LoginPedidos";
import { Bar } from "react-chartjs-2";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL =
  "https://script.google.com/macros/s/AKfycbwHrRUQZIWj8edBBQA-2tBA6J-mIVTypi5w5BFfBULIb5G1vpposGqQ2I3l-b3tjTO_/exec";

const Dashboard = () => {
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Falha ao buscar API", err));
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

  const totalRevenue = sumBy(filtered, "Total");
  const totalOrders = filtered.length;
  const avgQuantity =
    totalOrders > 0
      ? filtered.reduce((s, o) => s + Number(o["Quantidade"] || 0), 0) /
        totalOrders
      : 0;
  const pendingCount = filtered.filter((o) =>
    String(o.Status).toLowerCase().includes("pend")
  ).length;
  const completedCount = filtered.filter((o) =>
    String(o.Status).toLowerCase().includes("concl")
  ).length;

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
  const topProductEntry = Object.entries(productCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];
  const mostSold = topProductEntry
    ? `${topProductEntry[0]} (${topProductEntry[1]})`
    : "-";

  const barData = {
    labels: ["Concluído", "Pendente"],
    datasets: [
      {
        data: [completedCount, pendingCount],
        backgroundColor: ["#5d3d29", "#facc15"],
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const tables = Array.from({ length: 15 }, (_, i) => i + 1);
  const [selectedTable, setSelectedTable] = useState(null);
  const activeOrders = orders.filter(
    (o) => !String(o.Status).toLowerCase().includes("concl")
  );
  const getTableNumber = (o) => o.Mesa ?? o.Table ?? o.table ?? o.mesa ?? "";
  const isTableOccupied = (n) =>
    activeOrders.some((o) => {
      const t = String(getTableNumber(o)).replace(/mesa\s*/i, "").trim();
      return t === String(n);
    });
  const tableOrders = selectedTable
    ? orders.filter((o) => {
        const t = String(getTableNumber(o)).replace(/mesa\s*/i, "").trim();
        return t === String(selectedTable);
      })
    : [];
  const closeOrder = (order) => {
    setOrders(
      orders.map((o) => (o === order ? { ...o, Status: "Concluído" } : o))
    );
  };
  const editOrder = (order) => {
    const newStatus = prompt("Novo status:", order.Status);
    if (newStatus !== null) {
      setOrders(
        orders.map((o) => (o === order ? { ...o, Status: newStatus } : o))
      );
    }
  };

  const filterLabel =
    filter === "today" ? "Hoje" : filter === "week" ? "Semana" : "Mês";

  return (
    <div className="min-h-screen bg-[#fff4e4]">
      <header className="bg-[#5d3d29] text-[#fff4e4] py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-[#fff4e4] text-[#5d3d29] px-4 py-2 rounded"
          >
            Home
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-48 bg-white border-r p-4">
          <h2 className="font-bold mb-4">Mesas</h2>
          <ul className="space-y-2">
            {tables.map((n) => (
              <li
                key={n}
                onClick={() => setSelectedTable(n)}
                className={`flex items-center justify-between p-1 rounded cursor-pointer ${
                  selectedTable === n ? "bg-yellow-100" : ""
                }`}
              >
                <span>Mesa {n}</span>
                {isTableOccupied(n) ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1 container mx-auto px-4 py-8">
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

        {selectedTable && (
          <div className="mb-6">
            <h2 className="font-bold text-[#5d3d29] mb-2">
              Pedidos Mesa {selectedTable}
            </h2>
            {tableOrders.length ? (
              <ul className="space-y-2">
                {tableOrders.map((order, idx) => (
                  <li
                    key={order.id || idx}
                    className="bg-white p-3 rounded shadow flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {order.Nome || order.Cliente || "Cliente"}
                      </p>
                      <p className="text-sm">
                        {order["Produto(s)"] || order.Produtos}
                      </p>
                      <p className="text-sm">Status: {order.Status}</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <button
                        onClick={() => editOrder(order)}
                        className="text-xs px-2 py-1 bg-yellow-100 rounded"
                      >
                        Editar
                      </button>
                      {String(order.Status).toLowerCase().includes("concl") ? (
                        <span className="text-xs text-green-600 px-2 py-1">
                          Concluído
                        </span>
                      ) : (
                        <button
                          onClick={() => closeOrder(order)}
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded"
                        >
                          Fechar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum pedido para esta mesa</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold text-[#5d3d29]">
              R$ {revenueToday.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Faturamento Hoje</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold text-[#5d3d29]">
              R$ {revenueWeek.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Últimos 7 dias</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold text-[#5d3d29]">
              R$ {revenueMonth.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Últimos 30 dias</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded shadow space-y-2">
            <h2 className="font-bold text-[#5d3d29] text-lg mb-2">
              Resumo ({filterLabel})
            </h2>
            <p>Total de pedidos: {totalOrders}</p>
            <p>Faturamento: R$ {totalRevenue.toFixed(2)}</p>
            <p>Marmita mais vendida: {mostSold}</p>
            <p>Quantidade média: {avgQuantity.toFixed(2)}</p>
            <p>Pagamento mais usado: {mostPayment}</p>
            <p>Cliente com mais pedidos: {topCustomer}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
