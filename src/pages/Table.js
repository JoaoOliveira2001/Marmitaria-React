import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cardapio1 from "../components/Cardapio1";
import PriceButtons from "../components/PriceButtons";

export default function Table() {
  const [searchParams] = useSearchParams();
  const [mesa, setMesa] = useState(null);
  const tableKey = mesa ? `mesa_${mesa}_cart` : null;

  const [cardapio1, setCardapio1] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const url =
      "https://script.google.com/macros/s/AKfycbyYDPV06sKgZMVDEnGlih52_SNiLtQaXocYBzF37fu3rvZmdO5SVzLIo3Az9HotBE4N/exec";
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCardapio1(data))
      .catch(() => setCardapio1([]));
  }, []);

  // Persist mesa parameter to handle page reloads without query string
  useEffect(() => {
    const paramMesa = searchParams.get("mesa");
    if (paramMesa) {
      localStorage.setItem("mesa_atual", paramMesa);
      setMesa(paramMesa);
    } else {
      const stored = localStorage.getItem("mesa_atual");
      if (stored) setMesa(stored);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!tableKey) return;
    const saved = localStorage.getItem(tableKey);
    if (saved) setCart(JSON.parse(saved));
  }, [tableKey]);

  useEffect(() => {
    if (tableKey) {
      localStorage.setItem(tableKey, JSON.stringify(cart));
    }
  }, [cart, tableKey]);

  const addToCart = (item) => {
    const existing = cart.find(
      (ci) => ci.id === item.id && ci.price === item.price
    );
    if (existing) {
      setCart(
        cart.map((ci) =>
          ci === existing ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const changeQty = (idx, delta) => {
    setCart((c) =>
      c.map((item, i) =>
        i === idx ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const getTotal = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2);

  const fecharConta = async () => {
    if (!mesa || cart.length === 0) return;
    const order = {
      mesa,
      hora: new Date().toISOString(),
      itens: cart.map((i) => `${i.name} x${i.quantity}`).join(" | "),
      total: getTotal(),
      status: "New Order",
    };
    try {
      await fetch("/api/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      alert("Order sent successfully, please wait for service!");
      const dash = JSON.parse(localStorage.getItem("dashboard_orders") || "[]");
      dash.push(order);
      localStorage.setItem("dashboard_orders", JSON.stringify(dash));
      const occ = JSON.parse(localStorage.getItem("occupied_tables") || "[]");
      if (!occ.includes(mesa)) {
        occ.push(mesa);
        localStorage.setItem("occupied_tables", JSON.stringify(occ));
      }
      localStorage.removeItem(tableKey);
      setCart([]);
    } catch (e) {
      alert("Erro ao enviar pedido");
    }
  };

  if (mesa === null) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!mesa) {
    return <div className="p-4">Mesa não informada.</div>;
  }

  return (
    <div className="min-h-screen bg-[#fff4e4] p-4">
      <h2 className="text-2xl font-bold mb-4">Mesa {mesa}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {cardapio1.map((m) => (
          <div key={m.id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">{m.name}</h3>
            <p className="text-sm mb-2">{m.description}</p>
            <PriceButtons price={m.price} item={m} onAdd={addToCart} />
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Carrinho</h3>
        {cart.length === 0 && <p>Nenhum item.</p>}
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center mb-2">
            <span>
              {item.name} - R$ {item.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => changeQty(idx, -1)} className="px-2">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQty(idx, 1)} className="px-2">+</button>
              <button onClick={() => removeItem(idx)} className="px-2 text-red-500">x</button>
            </div>
          </div>
        ))}
        {cart.length > 0 && (
          <>
            <div className="font-bold mt-2">Total: R$ {getTotal()}</div>
            <button
              onClick={fecharConta}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Fechar Conta
            </button>
          </>
        )}
      </div>
    </div>
  );
}
