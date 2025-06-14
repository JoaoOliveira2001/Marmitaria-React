import React, { useEffect, useState } from "react";

const MESAS_API =
  "https://script.google.com/macros/s/AKfycbxtHy6Vk6CDa3i6HKT6pYpaaVWovvtB8KZt6vdx8um3xLwzTiicHYB2BxdIMhgdt08l/exec";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function MesasMenu() {
  const [mesasOcupadas, setMesasOcupadas] = useState([]);

  useEffect(() => {
    const fetchMesas = () => {
      fetch(MESAS_API)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.mesas)) {
            setMesasOcupadas(data.mesas.map(String));
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

  return (
    <aside className="fixed top-0 left-0 h-full w-40 bg-[#5d3d29] text-[#fff4e4] p-4 space-y-2 overflow-y-auto z-40">
      <h2 className="text-lg font-bold mb-4">Tables</h2>
      {tables.map((t) => {
        const isOccupied = mesasOcupadas.includes(String(t));
        return (
          <a
            key={t}
            href={`/#/mesa?mesa=${t}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded px-2 py-1 text-center ${
              isOccupied ? "bg-yellow-300 text-[#5d3d29]" : "bg-[#fff4e4] text-[#5d3d29]"
            }`}
          >
            Table {t}
          </a>
        );
      })}
    </aside>
  );
}
