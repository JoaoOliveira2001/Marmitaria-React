import React from "react";

// Renders size buttons based on a price string
export default function PriceButtons({ price, item, onAdd }) {
  if (!price) return null;
  const prices = String(price)
    .split(',')
    .map((p) => parseFloat(p.trim()))
    .filter((p) => !Number.isNaN(p));

  const sizeLabels = ['P', 'M', 'G'];

  if (prices.length <= 1) {
    const value = prices[0] ?? 0;
    return (
      <button
        onClick={() => onAdd({ ...item, price: value })}
        className="bg-gradient-to-r bg-[#5d3d29] text-white px-6 py-2 rounded-full"
      >
        Adicionar
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      {prices.map((val, idx) => (
        <button
          key={idx}
          onClick={() => onAdd({ ...item, price: val, size: sizeLabels[idx] })}
          className="bg-gradient-to-r bg-[#5d3d29] text-white px-4 py-2 rounded-full"
        >
          {sizeLabels[idx]} - R$ {val.toFixed(2)}
        </button>
      ))}
    </div>
  );
}
