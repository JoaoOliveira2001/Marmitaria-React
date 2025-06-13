import React from "react";

const TableSidebar = ({ tableStatus = {} }) => {
  const tables = Array.from({ length: 15 }, (_, i) => i + 1);
  return (
    <div className="fixed top-0 left-0 h-full w-48 bg-[#fff4e4] border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-[#5d3d29]">Mesas</h2>
      <ul className="space-y-2">
        {tables.map((n) => (
          <li key={n} className="flex justify-between items-center">
            <span>Mesa {n}</span>
            <span>{tableStatus[n] === "occupied" ? "❌" : "✅"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableSidebar;
