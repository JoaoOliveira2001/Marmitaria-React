import React, { useEffect, useState } from "react";

const MESAS_API =
  "https://script.google.com/macros/s/AKfycbzcncEtTmtS7DrJdfN5dTAaQbNr02ha_Psql6vdlbjOI8gJEM5ioayiKMpRwUxzzHd_/exec";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function MesasMenu() {
  const [mesasOcupadas, setMesasOcupadas] = useState([]);
  const [checkoutRequests, setCheckoutRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("checkoutRequests") || "[]");
    } catch {
      return [];
    }
  });
  const [openTable, setOpenTable] = useState(null);

  useEffect(() => {
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
    fetchMesas();
    const id = setInterval(fetchMesas, 60000);
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
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const freeTable = async (mesa) => {
    try {
      await fetch("/api/limpaMesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesa: String(mesa) }),
      });
    } catch (err) {
      console.error("Erro ao liberar mesa", err);
    }
    setMesasOcupadas((prev) => prev.filter((m) => m !== String(mesa)));
    setOpenTable(null);
    setCheckoutRequests((prev) => {
      const updated = prev.filter((m) => m !== String(mesa));
      localStorage.setItem("checkoutRequests", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-40 bg-[#5d3d29] text-[#fff4e4] p-4 space-y-2 overflow-y-auto z-40">
      <h2 className="text-lg font-bold mb-4">Mesas</h2>
      {tables.map((t) => {
        const isOccupied = mesasOcupadas.includes(String(t));
        const isCheckout = checkoutRequests.includes(String(t));
        const isOpen = openTable === t;
        return (
          <div key={t} className="relative">
            <button
              onClick={() => setOpenTable((prev) => (prev === t ? null : t))}
              className={`w-full rounded px-2 py-1 text-center focus:outline-none ${
                isCheckout
                  ? "bg-red-100 border-2 border-red-500 text-[#5d3d29]"
                  : isOccupied
                  ? "bg-yellow-300 text-[#5d3d29]"
                  : "bg-[#fff4e4] text-[#5d3d29]"
              }`}
            >
              Mesa {t}
            </button>
            {isOpen && (
              <div className="absolute left-full top-0 ml-2 bg-white text-[#5d3d29] rounded shadow p-2 space-y-2 z-50">
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
                  className="w-full bg-green-500 text-white px-2 py-1 rounded"
                >
                  ✔ Liberar Mesa
                </button>
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
