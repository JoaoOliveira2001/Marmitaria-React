import React from "react";
import { Line } from "react-chartjs-2";

export default function PainelGrafico({ data, options }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <Line data={data} options={options} className="w-full" />
    </div>
  );
}
