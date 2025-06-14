import React, { useEffect, useState } from "react";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function MesasMenu() {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      setLoading(true);
      fetch("/api/mesas-status")
        .then((res) => {
          if (!res.ok) throw new Error(`Erro ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const mesasArray = Array.isArray(data.mesas) ? data.mesas : data;
          const occupied = new Set(mesasArray.map((d) => String(d).trim()));
          const map = {};
          tables.forEach((t) => {
            map[t] = occupied.has(String(t));
          });
          setStatus(map);
          setError(null);
        })
        .catch((err) => {
          console.error("Falha ao buscar status das mesas:", err);
          setError("Erro ao buscar mesas");
        })
        .finally(() => setLoading(false));
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="fixed top-0 left-0 h-full w-40 bg-[#5d3d29] text-[#fff4e4] p-4 space-y-2 overflow-y-auto z-40">
      <h2 className="text-lg font-bold mb-4">Tables</h2>
      {loading && <p className="text-sm">Carregando...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {tables.map((t) => (
        <a
          key={t}
          href={`/#/mesa?mesa=${t}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`block rounded px-2 py-1 text-center ${
            status[t] ? "bg-yellow-300 text-[#5d3d29]" : "bg-[#fff4e4] text-[#5d3d29]"
          }`}
        >
          Table {t}
        </a>
      ))}
    </aside>
  );
}
