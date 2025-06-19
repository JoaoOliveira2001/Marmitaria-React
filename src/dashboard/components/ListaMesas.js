import React, { useEffect, useState } from "react";
import { liberarMesa } from "../../utils/gsActions";

const MESAS_API =
  "https://script.google.com/macros/s/AKfycbzcncEtTmtS7DrJdfN5dTAaQbNr02ha_Psql6vdlbjOI8gJEM5ioayiKMpRwUxzzHd_/exec";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function ListaMesas() {
  const [mesasOcupadas, setMesasOcupadas] = useState([]);
  const [checkoutRequests, setCheckoutRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("checkoutRequests") || "[]");
    } catch {
      return [];
    }
  });
  const [openTable, setOpenTable] = useState(null);
  const [freedTable, setFreedTable] = useState(null);

  const fetchMesas = () => {
    fetch(MESAS_API)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.mesas)) {
          const unique = Array.from(new Set(data.mesas.map(String)));
          setMesasOcupadas(unique);
        } else {
          setMesasOcupadas([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar mesas", err);
        setMesasOcupadas([]);
      });
  };

  useEffect(() => {
    fetchMesas();
    const id = setInterval(fetchMesas, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "checkoutRequests") {
        try {
          setCheckoutRequests(JSON.parse(e.newValue || "[]"));
        } catch {
          setCheckoutRequests([]);
        }
      } else if (e.key === "refreshData") {
        fetchMesas();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const freeTable = async (mesa) => {
    try {
      const resp = await liberarMesa(String(mesa));
      const ok = resp && (resp.success === true || resp.success === "true");
      if (!ok) {
        throw new Error('Falha na liberacao');
      }
    } catch (err) {
      console.error("Erro ao liberar mesa", err);
    }
    setMesasOcupadas((prev) => prev.filter((m) => m !== String(mesa)));
    setCheckoutRequests((prev) => {
      const updated = prev.filter((m) => m !== String(mesa));
      const value = JSON.stringify(updated);
      localStorage.setItem("checkoutRequests", value);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "checkoutRequests", newValue: value })
      );
      return updated;
    });
    setTimeout(() => {
      const val = String(Date.now());
      localStorage.setItem("refreshData", val);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "refreshData", newValue: val })
      );
    }, 1000);
    setFreedTable(mesa);
    setTimeout(() => {
      setFreedTable(null);
      setOpenTable(null);
    }, 1500);
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-48 md:w-60 bg-[#5d3d29] text-[#fff4e4] p-4 space-y-2 overflow-y-auto z-40">
      <h2 className="text-lg font-bold mb-4">Mesas</h2>
      {tables.map((t) => {
        const isOccupied = mesasOcupadas.includes(String(t));
        const isCheckout = checkoutRequests.includes(String(t));
        const isOpen = openTable === t;
        return (
          <div key={t} className="relative">
            <button
              onClick={() => setOpenTable((prev) => (prev === t ? null : t))}
              className={`w-full rounded px-2 py-1 text-sm text-center focus:outline-none ${
                isCheckout
                  ? "bg-red-200 border border-red-500 text-[#5d3d29]"
                  : isOccupied
                    ? "bg-yellow-300 text-[#5d3d29]"
                    : "bg-[#fff4e4] text-[#5d3d29]"
              }`}
            >
              <span className="mr-1">{isOccupied ? "🔴" : "🟢"}</span> Mesa {t}
            </button>
            {isOpen && (
              <div className="absolute md:left-full md:top-0 md:ml-2 left-0 top-full mt-2 w-48 sm:w-56 md:w-60 bg-white text-[#5d3d29] rounded shadow p-2 space-y-2 z-50">
                <a
                  href={`/#/mesa?mesa=${t}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#5d3d29] text-[#fff4e4] px-2 py-1 rounded text-center"
                >
                  Acessar Mesa
                </a>
                <button
                  onClick={() => freeTable(t)}
                  className={`w-full px-2 py-1 rounded ${
                    freedTable === t ? "bg-green-600 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {freedTable === t ? "✔ Mesa Liberada" : "✔ Liberar Mesa"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
