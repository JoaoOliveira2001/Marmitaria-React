import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceButtons, { parsePrices } from "../components/PriceButtons";

const Mesa = () => {
  const location = useLocation();
  const [mesa, setMesa] = useState(null);
  const [cardapio, setCardapio] = useState([]);
  const [activeType, setActiveType] = useState("marmita");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mesaParam = params.get("mesa");
    if (mesaParam) {
      localStorage.setItem("mesaAtual", mesaParam);
      setMesa(mesaParam);
    } else {
      const stored = localStorage.getItem("mesaAtual");
      if (stored) setMesa(stored);
    }
  }, [location.search]);

  useEffect(() => {
    const url =
      "https://script.google.com/macros/s/AKfycbyYDPV06sKgZMVDEnGlih52_SNiLtQaXocYBzF37fu3rvZmdO5SVzLIo3Az9HotBE4N/exec";
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => setCardapio(data))
      .catch((err) => {
        console.error("Falha ao carregar cardápio:", err);
        setCardapio([]);
      });
  }, []);

  const addToCart = (item) => {
    const existing = cart.find((ci) => ci.id === item.id && ci.price === item.price);
    if (existing) {
      setCart(
        cart.map((ci) =>
          ci.id === item.id && ci.price === item.price
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} adicionado!`, { position: "bottom-right", autoClose: 1500 });
  };

  const removeFromCart = (id, price) => {
    const existing = cart.find((item) => item.id === id && item.price === price);
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(cart.filter((item) => !(item.id === id && item.price === price)));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id && item.price === price
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((tot, item) => tot + item.price * item.quantity, 0).toFixed(2);
  };

  const finalizarPedido = async () => {
    if (!mesa) {
      alert("Mesa não identificada");
      return;
    }
    if (cart.length === 0) {
      alert("Seu pedido está vazio");
      return;
    }
    const pedido = {
      mesa,
      produtos: cart.map((item) => `${item.name} x${item.quantity}`).join(" | "),
      quantidade: cart.reduce((t, i) => t + i.quantity, 0),
      total: getTotalPrice(),
      status: "Pendente",
    };
    try {
      const response = await fetch("/api/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Erro ao enviar pedido:", text);
        alert("Erro ao enviar pedido");
        return;
      }
      alert("Pedido enviado!");
      setCart([]);
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao enviar pedido");
    }
  };

  const tabs = [
    { key: "marmita", label: "Marmitas" },
    { key: "bebida", label: "Bebidas" },
    { key: "porcao", label: "Porções" },
  ];

  const filtered = cardapio.filter((item) => item.type === activeType);

  return (
    <div className="min-h-screen bg-[#fff4e4]">
      <header className="bg-[#5d3d29]">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <img
            src="https://i.imgur.com/wYccCFb.jpeg"
            alt="Logo"
            className="w-20 h-20 object-contain rounded-full"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6 space-x-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={`px-4 py-2 rounded-full font-semibold ${
                activeType === t.key ? "bg-[#5d3d29] text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-4">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto shadow-lg"
                />
                <h3 className="text-xl font-bold">{m.name}</h3>
              </div>
              <p className="text-gray-600 mb-4 text-center">{m.description}</p>
              <div className="flex justify-between items-center mb-4">
                {m.time && <span>⏰ {m.time}</span>}
                <span className="text-2xl font-bold text-[#5d3d29]">
                  {(() => {
                    const p = parsePrices(m.price, m);
                    if (p.length === 0) return "R$ 0.00";
                    return `R$ ${p[0].toFixed(2)}` + (p.length > 1 ? "+" : "");
                  })()}
                </span>
              </div>
              <PriceButtons price={m.price} item={m} onAdd={addToCart} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6" id="cart">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Seu Pedido
          </h3>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhum item adicionado</p>
          ) : (
            <div className="space-y-4 mb-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-[#5d3d29]">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id, item.price)}
                      className="bg-red-500 text-white p-1 rounded-full"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-500 text-white p-1 rounded-full"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center font-bold mb-4">
            <span>Total:</span>
            <span className="text-[#5d3d29]">R$ {getTotalPrice()}</span>
          </div>
          <button
            onClick={finalizarPedido}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <PhoneIcon /> Finalizar Pedido
          </button>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.27 12.27 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6 6l.36-.36a2 2 0 0 1 2.11-.45 12.27 12.27 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

export default Mesa;
