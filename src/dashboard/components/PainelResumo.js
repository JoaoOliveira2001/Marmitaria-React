import React from "react";
import { DollarSign, CalendarRange, CalendarCheck } from "lucide-react";

export default function PainelResumo({
  revenueToday,
  revenueWeek,
  revenueMonth,
  filter,
  setFilter,
}) {
  const filterButtons = [
    ["today", "Hoje"],
    ["week", "Semana"],
    ["month", "Mês"],
  ];

  return (
    <div>
      <div className="flex justify-center mb-6 space-x-2">
        {filterButtons.map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`border px-3 py-1 rounded-full text-sm ${
              filter === val
                ? "bg-[#5d3d29] text-[#fff4e4]"
                : "bg-white text-[#5d3d29]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow text-center flex flex-col gap-1 items-center">
          <DollarSign className="w-5 h-5 text-[#5d3d29]" />
          <div className="text-xl font-bold text-[#5d3d29]">
            R$ {revenueToday}
          </div>
          <div className="text-sm text-gray-500">Faturamento Hoje</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center flex flex-col gap-1 items-center">
          <CalendarRange className="w-5 h-5 text-[#5d3d29]" />
          <div className="text-xl font-bold text-[#5d3d29]">
            R$ {revenueWeek}
          </div>
          <div className="text-sm text-gray-500">Últimos 7 dias</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center flex flex-col gap-1 items-center">
          <CalendarCheck className="w-5 h-5 text-[#5d3d29]" />
          <div className="text-xl font-bold text-[#5d3d29]">
            R$ {revenueMonth}
          </div>
          <div className="text-sm text-gray-500">Últimos 30 dias</div>
        </div>
      </div>
    </div>
  );
}
