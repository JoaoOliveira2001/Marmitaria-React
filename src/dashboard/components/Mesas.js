import React, { useEffect, useState } from "react";

const MESAS_API =
  "https://script.google.com/macros/s/AKfycbzcncEtTmtS7DrJdfN5dTAaQbNr02ha_Psql6vdlbjOI8gJEM5ioayiKMpRwUxzzHd_/exec";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function Mesas() {
  const [mesasOcupadas, setMesasOcupadas] = useState([]);
  const [selected, setSelected] = useState(null);

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

  const liberarMesa = (mesa) => {
    console.log("Liberar mesa", mesa);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mesas</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {tables.map((t) => {
          const isOccupied = mesasOcupadas.includes(String(t));
          return (
            <button
              key={t}
              onClick={() => setSelected(t)}
              className={`rounded-lg p-4 shadow text-center font-semibold ${
                isOccupied ? "bg-yellow-300 text-[#5d3d29]" : "bg-[#fff4e4] text-[#5d3d29]"
              }`}
            >
              Mesa {t}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full relative shadow-xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Mesa {selected}</h3>
            <div className="flex flex-col gap-2">
              <a
                href={`/#/mesa?mesa=${selected}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5d3d29] text-[#fff4e4] py-2 rounded text-center"
              >
                Acessar Mesa
              </a>
              <button
                onClick={() => {
                  liberarMesa(selected);
                  setSelected(null);
                }}
                className="bg-red-500 text-white py-2 rounded"
              >
                Liberar Mesa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
