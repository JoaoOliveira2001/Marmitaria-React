import React from "react";

/**
 * Parse the price field or size properties (Pequeno, Medio, Grande)
 * and return an array of numeric prices.
 */
export function parsePrices(price, item = {}) {
  let values = [];

  if (price !== undefined && price !== null && price !== "") {
    if (typeof price === "number") {
      values = [Number(price)];
    } else {
      values = String(price)
        .split(",")
        .map((p) => parseFloat(p.trim()))
        .filter((n) => !Number.isNaN(n));
    }
  }

  if (!values.length) {
    const keys = ["Pequeno", "Medio", "Grande"];
    values = keys
      .map((k) => item[k])
      .filter((v) => v !== undefined && v !== null)
      .map((v) => parseFloat(v))
      .filter((n) => !Number.isNaN(n));
  }

  return values;
}

// Renders size buttons based on available prices
export default function PriceButtons({ price, item = {}, onAdd = () => {} }) {
  const prices = parsePrices(price, item);
  const sizeLabels = ["Mini", "G", "EXG"];

  if (!prices.length) return null;

  if (prices.length === 1) {
    const value = prices[0];
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
