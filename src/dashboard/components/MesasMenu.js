import React, { useEffect, useState } from "react";

const MESAS_API =
  "https://script.google.com/macros/s/AKfycbzcncEtTmtS7DrJdfN5dTAaQbNr02ha_Psql6vdlbjOI8gJEM5ioayiKMpRwUxzzHd_/exec";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function MesasMenu({ onCheckoutRequests }) {
  const [mesasInfo, setMesasInfo] = useState([]);

  useEffect(() => {
    const fetchMesas = () => {
      fetch(MESAS_API)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.mesas)) {
            if (typeof data.mesas[0] === "object") {
              setMesasInfo(data.mesas);
              const pending = data.mesas
                .filter((m) => m.status === "requestingCheckout")
                .map((m) => String(m.numero || m.mesa || m.id));
              onCheckoutRequests && onCheckoutRequests(pending);
            } else {
              const unique = Array.from(new Set(data.mesas.map(String)));
              setMesasInfo(unique.map((n) => ({ numero: n })));
              onCheckoutRequests && onCheckoutRequests([]);
            }
          } else {
            setMesasInfo([]);
            onCheckoutRequests && onCheckoutRequests([]);
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar mesas", err);
          setMesasInfo([]);
          onCheckoutRequests && onCheckoutRequests([]);
        });
    };
    fetchMesas();
    const id = setInterval(fetchMesas, 60000);
    return () => clearInterval(id);
  }, [onCheckoutRequests]);

  return (
    <aside className="fixed top-0 left-0 h-full w-40 bg-[#5d3d29] text-[#fff4e4] p-4 space-y-2 overflow-y-auto z-40">
      <h2 className="text-lg font-bold mb-4">Mesas</h2>
      {tables.map((t) => {
        const info = mesasInfo.find(
          (m) => String(m.numero || m.mesa || m.id) === String(t)
        );
        const status = info?.status || (info ? "occupied" : "available");
        const isOccupied = status !== "available";
        const isRequesting = status === "requestingCheckout";
        return (
          <a
            key={t}
            href={`/#/mesa?mesa=${t}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded px-2 py-1 text-center ${
              isRequesting
                ? "bg-red-100 border border-red-500 text-red-700 animate-pulse"
                : isOccupied
                ? "bg-yellow-300 text-[#5d3d29]"
                : "bg-[#fff4e4] text-[#5d3d29]"
            }`}
          >
            Mesa {t}
          </a>
        );
      })}
    </aside>
  );
}
