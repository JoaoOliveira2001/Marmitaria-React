import React from "react";

const tables = Array.from({ length: 15 }, (_, i) => i + 1);

export default function MesasMenu() {
  return (
    <aside className="fixed top-0 left-0 h-full w-40 bg-[#5d3d29] text-[#fff4e4] p-4 space-y-2 overflow-y-auto z-40">
      <h2 className="text-lg font-bold mb-4">Tables</h2>
      {tables.map((t) => (
        <a
          key={t}
          href={`/#/mesa?mesa=${t}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#fff4e4] text-[#5d3d29] rounded px-2 py-1 text-center"
        >
          Table {t}
        </a>
      ))}
    </aside>
  );
}
