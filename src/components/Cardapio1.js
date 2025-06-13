// src/components/Cardapio1.js
import React from 'react';

const marmitas = [
  {
    id: 1,
    name: "Marmita Executiva",
    description: "Arroz, feijão, bife grelhado, batata frita e salada",
    price: 18.9,
    image: "https://i.imgur.com/irH6zDT.png",
    rating: 4.8,
    time: "25-35 min",
    type: "marmita",
  },
  {
    id: 2,
    name: "Marmita Frango",
    description: "Arroz, feijão, frango grelhado, farofa e legumes",
    price: 16.9,
    image: "https://i.imgur.com/fNkPi7U.png",
    rating: 4.9,
    time: "20-30 min",
    type: "marmita",
  },
  // … adicione ou remova objetos aqui para alterar os pratos do cardápio 1 …
];

export default function Cardapio1({ addToCart }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {marmitas.map((m) => (
        <div
          key={m.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="mb-2">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto shadow-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x150/f97316/ffffff?text=Marmita";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {m.name}
              </h3>
            </div>

            <p className="text-gray-600 text-center mb-4">
              {m.description}
            </p>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-yellow-500">
                {/* se quiser trocar o ícone, importe outro de lucide-react */}
                <span className="ml-1 text-sm text-gray-600">
                  {m.rating}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                {/* ícone de relógio */}
                <span className="ml-1 text-sm">{m.time}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[#5d3d29]">
                R$ {m.price.toFixed(2)}
              </span>
              <button
                onClick={() => addToCart(m)}      // precisa receber addToCart via props
                className="bg-gradient-to-r from-[#5d3d29] to-[#5d3d29] text-white px-6 py-2 rounded-full hover:from-[#5d3d29] hover:to-[#5d3d29] transition-all transform hover:scale-105 shadow-lg"
              >
                {/* ícone de "+" */}
                Adicionar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
