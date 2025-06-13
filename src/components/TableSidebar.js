import React from "react";

const TableSidebar = ({ orders }) => {
  const tables = [];
  for (let i = 1; i <= 15; i++) {
    const hasActive = orders.some((o) => {
      const table = o.Mesa || o.mesa || o.Table || o.table;
      if (!table) return false;
      const num = parseInt(table, 10);
      if (isNaN(num)) return false;
      const active = !String(o.Status || "").toLowerCase().includes("concl");
      return num === i && active;
    });
    tables.push({ number: i, occupied: hasActive });
  }

  return (
    <aside className="bg-white p-4 rounded shadow w-36 mr-4">
      <h3 className="font-bold mb-2 text-[#5d3d29]">Mesas</h3>
      <ul className="space-y-1">
        {tables.map((t) => (
          <li key={t.number} className="flex justify-between items-center">
            <span>Mesa {t.number}</span>
            <span>{t.occupied ? "❌" : "✅"}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TableSidebar;
