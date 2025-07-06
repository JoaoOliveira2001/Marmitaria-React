import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceButtons, { parsePrices } from "../components/PriceButtons";
import moverMesa from "../Menu";

const Mesa = () => {
  const location = useLocation();
  const [mesa, setMesa] = useState(null);
  const [cardapio, setCardapio] = useState([]);
  const [now, setNow] = useState(new Date());
  const [allowedCardapio, setAllowedCardapio] = useState(null);
  const [horarios, setHorarios] = useState({
    cardapio1: { inicio: 10, fim: 15 },
    cardapio2: { inicio: 15, fim: 22 },
  });
  const [horariosError, setHorariosError] = useState(false);
  const [activeType, setActiveType] = useState("marmita");
  const [cart, setCart] = useState([]);
  const [pedidosMesa, setPedidosMesa] = useState(() => {
    const stored = localStorage.getItem("pedidosMesa");
    return stored ? JSON.parse(stored) : [];
  });
  const [showOrders, setShowOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const cartRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendingOrder, setSendingOrder] = useState(false);
  const [closingTab, setClosingTab] = useState(false);

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
      .then((data) => {
        const normalized = data.map((it) => ({
          ...it,
          cardapio: String(it.cardapio ?? it.Cardapio ?? ""),
        }));
        setCardapio(normalized);
      })
      .catch((err) => {
        console.error("Falha ao carregar cardápio:", err);
        setCardapio([]);
      });
  }, []);

  // carrega horários de funcionamento dos cardápios
  useEffect(() => {
    const url =
      "https://script.google.com/macros/s/AKfycbzokXTguI-RRjMaVSmSwEStnDupPEgHXcMqIRX2Ss-f0tq2WiwTcQHxYztIgurtuN3Z/exec";
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setHorarios(data);
        setHorariosError(false);
      })
      .catch((err) => {
        console.error("Falha ao carregar horários:", err);
        setHorariosError(true);
      });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = now.getHours();
    let menu = null;
    const { cardapio1, cardapio2 } = horarios;
    if (h >= cardapio1.inicio && h < cardapio1.fim) menu = "1";
    else if (h >= cardapio2.inicio && h < cardapio2.fim) menu = "2";
    setAllowedCardapio(menu);
  }, [now, horarios]);

  useEffect(() => {
    if (allowedCardapio === "1") {
      setActiveType("marmita");
    } else if (allowedCardapio === "2") {
      setActiveType("porcao");
    }
  }, [allowedCardapio]);

  const addToCart = (item) => {
    const existing = cart.find(
      (ci) => ci.id === item.id && ci.price === item.price,
    );
    if (existing) {
      setCart(
        cart.map((ci) =>
          ci.id === item.id && ci.price === item.price
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, observations: "" }]);
    }
    toast.success(`${item.name} adicionado!`, {
      position: "bottom-right",
      autoClose: 1500,
    });
  };

  const removeFromCart = (id, price) => {
    const existing = cart.find(
      (item) => item.id === id && item.price === price,
    );
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(cart.filter((item) => !(item.id === id && item.price === price)));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id && item.price === price
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      );
    }
  };

  const updateObservations = (index, observations) => {
    setCart(
      cart.map((item, idx) =>
        idx === index ? { ...item, observations } : item,
      ),
    );
  };

  const getTotalPrice = () => {
    return cart
      .reduce((tot, item) => tot + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const scrollToCart = () => {
    if (cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const resumoPedidos = useMemo(() => {
    const map = new Map();
    pedidosMesa.forEach((p) => {
      p.items.forEach((it) => {
        const key = `${it.name}|${it.price}`;
        if (map.has(key)) {
          map.get(key).quantity += it.quantity;
        } else {
          map.set(key, {
            name: it.name,
            price: it.price,
            quantity: it.quantity,
          });
        }
      });
    });
    const items = Array.from(map.values());
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    return { items, total };
  }, [pedidosMesa]);

  const adicionarPedido = async () => {
    if (!mesa) {
      alert("Mesa não identificada");
      return;
    }
    if (cart.length === 0) {
      alert("Seu pedido está vazio");
      return;
    }

    const produtos = cart
      .map((item) => {
        let desc = `${item.name} x${item.quantity}`;
        if (item.observations && item.observations.trim()) {
          desc += ` (Obs: ${item.observations})`;
        }
        return desc;
      })
      .join(" | ");

    const payload = {
      mesa,
      produtos,
      quantidade: cart.reduce((t, i) => t + i.quantity, 0),
      total: getTotalPrice(),
      status: "Pendente",
    };

    setSendingOrder(true);

    const pedido = {
      items: cart,
      quantidade: payload.quantidade,
      total: parseFloat(payload.total),
    };

    const updated = [...pedidosMesa, pedido];
    setPedidosMesa(updated);
    localStorage.setItem("pedidosMesa", JSON.stringify(updated));
    setCart([]);

    toast.success(
      "Tudo certo! Seu pedido foi enviado para a cozinha. Um atendente virá à sua mesa em breve com a sua refeição.",
      {
        position: "bottom-right",
        autoClose: 3000,
      },
    );

    try {
      const response = await fetch("/api/cria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Erro ao registrar pedido:", text);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setSendingOrder(false);
    }
  };
  const handleFecharConta = () => {
    if (!mesa) {
      alert("Mesa não identificada");
      return;
    }
    if (pedidosMesa.length === 0) {
      alert("Nenhum pedido salvo");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmarFechamento = async () => {
    const { items, total } = resumoPedidos;

    const produtos = items
      .map((it) => `${it.name} x${it.quantity}`)
      .join(" | ");

    const payload = {
      mesa,
      produtos,
      total: total.toFixed(2),
      status: "Finalized",
    };

    const pedidosSalvos = JSON.parse(localStorage.getItem("pedidosMesa") || "[]");

    setClosingTab(true);
    setShowSuccess(true);
    setShowConfirmation(false);

    // limpar estado local imediatamente
    setPedidosMesa([]);
    setCart([]);
    setMesa(null);
    localStorage.removeItem("pedidosMesa");
    localStorage.removeItem("mesaAtual");
    setShowOrders(false);

    try {
      const response = await fetch("/api/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Erro ao enviar pedido:", text);
      } else {
        try {
          await moverMesa(String(mesa));
          toast.success("Conta enviada para fechamento!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        } catch (err) {
          console.error("Erro ao avisar Apps Script:", err);
        }
      }

      try {
        await fetch("/api/fechar-conta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mesa: String(mesa) }),
        });
      } catch (err) {
        console.error("Erro ao consolidar pedidos:", err);
      }

      try {
        await fetch("/api/webhook-fechar-conta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mesa: String(mesa), pedidos: pedidosSalvos }),
        });
      } catch (err) {
        console.error("Erro ao enviar itens para webhook:", err);
      }

      try {
        const stored = JSON.parse(localStorage.getItem("checkoutRequests") || "[]");
        if (!stored.includes(String(mesa))) {
          const updated = [...stored, String(mesa)];
          localStorage.setItem("checkoutRequests", JSON.stringify(updated));
        } else {
          // trigger storage event
          localStorage.setItem("checkoutRequests", JSON.stringify(stored));
        }
      } catch {
        localStorage.setItem("checkoutRequests", JSON.stringify([String(mesa)]));
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setClosingTab(false);
    }
  };

  // Check current day and hour to determine available menu
  const day = now.getDay();
  const hour = now.getHours();

  // allowedCardapio é atualizado no efeito acima

  const tabs = [
    { key: "marmita", label: "Marmitas" },
    { key: "porcao", label: "Porções" },
    { key: "bebida", label: "Bebidas" },
  ];

  const filtered = cardapio.filter(
    (item) => item.type === activeType && item.cardapio === allowedCardapio,
  );

  // Build menu or show closed message
  let menuSection;
  if (day === 1 || !allowedCardapio) {
    menuSection = (
      <p className="text-center font-bold text-red-500">
        Estamos fechados neste horário
      </p>
    );
  } else {
    menuSection = (
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {filtered.length === 0 ? (
          <div className="col-span-2 text-center text-red-500 font-semibold space-y-1">
            <p>🔒 No momento, este cardápio está indisponível.</p>
            <p>
              🕒 Marmitas: das {horarios.inicioCardapio1 ?? horarios.cardapio1?.inicio}h às {horarios.fimCardapio1 ?? horarios.cardapio1?.fim}h |
              Porções e Bebidas: das {horarios.inicioCardapio2 ?? horarios.cardapio2?.inicio}h às {horarios.fimCardapio2 ?? horarios.cardapio2?.fim}h
            </p>
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 text-center">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-xl font-bold mt-2">{m.name}</h3>
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
          ))
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff4e4]">
      {mesa && (
        <div className="w-full bg-yellow-200 text-[#5d3d29] font-semibold text-center py-2">
          Mesa {mesa}
        </div>
      )}
      <header className="bg-[#5d3d29]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <img
            src="https://i.imgur.com/wYccCFb.jpeg"
            alt="Logo Orçamenthus"
            className="w-20 h-20 object-contain rounded-full"
          />
          <h1 className="text-2xl font-bold text-[#fff4e4]">Orçamenthus</h1>
          {mesa && (
            <span className="ml-auto text-white font-semibold">
              Mesa {mesa}
            </span>
          )}
        </div>
      </header>

      {horariosError && (
        <p className="text-center text-red-500 mt-4">
          Não foi possível carregar os horários. Utilizando valores padrão.
        </p>
      )}

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {allowedCardapio === "2" ? "🍟 Porções e Bebidas" : "🍱 Marmitas"}
        </h2>
        <div className="flex justify-center mb-6 space-x-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={`px-4 py-2 rounded-full font-semibold ${
                activeType === t.key
                  ? "bg-[#5d3d29] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {menuSection}
        <div
          className="bg-white rounded-2xl shadow-lg p-6"
          id="cart"
          ref={cartRef}
        >
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhum item adicionado</p>
          ) : (
            <div className="space-y-4 mb-4">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-[#5d3d29]">
                        R$ {item.price.toFixed(2)}
                      </p>
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
                  <textarea
                    value={item.observations || ""}
                    onChange={(e) => updateObservations(idx, e.target.value)}
                    placeholder="Observações..."
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5d3d29] focus:border-transparent"
                    rows="2"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center font-bold mb-4">
            <span>Total:</span>
            <span className="text-[#5d3d29]">R$ {getTotalPrice()}</span>
          </div>
          <button
            onClick={adicionarPedido}
            disabled={sendingOrder}
            className={`w-full text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 ${
              sendingOrder
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <PhoneIcon /> Enviar pedido para cozinha
          </button>
          <button
            onClick={handleFecharConta}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-2"
          >
            Fechar Conta
          </button>
        </div>
      </main>
      <button
        onClick={scrollToCart}
        className="fixed bottom-4 right-4 bg-[#5d3d29] text-white px-4 py-2 rounded-full shadow-lg"
      >
        Ver meus pedidos
      </button>

      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              Meus Pedidos{mesa ? ` – Mesa ${mesa}` : ""}
            </h3>
            {pedidosMesa.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum pedido salvo</p>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                {pedidosMesa.map((p, idx) => (
                  <div
                    key={idx}
                    className={`border p-3 rounded-lg shadow mb-2 cursor-pointer transition-colors ${
                      expandedOrder === idx ? "bg-gray-50" : "bg-white"
                    }`}
                    onClick={() =>
                      setExpandedOrder(expandedOrder === idx ? null : idx)
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Pedido {idx + 1}</p>
                        <p className="text-sm text-gray-600">
                          {p.quantidade} itens - R$ {p.total.toFixed(2)}
                        </p>
                      </div>
                      {expandedOrder === idx ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {expandedOrder === idx && (
                      <ul className="mt-2 text-sm text-gray-700 space-y-1">
                        {p.items.map((it, i) => (
                          <React.Fragment key={i}>
                            <li className="flex justify-between">
                              <span>
                                {it.name} x{it.quantity}
                              </span>
                              <span>
                                R$ {(it.price * it.quantity).toFixed(2)}
                              </span>
                            </li>
                            {it.observations && (
                              <li className="text-xs text-gray-500 italic ml-2">
                                Obs: {it.observations}
                              </li>
                            )}
                          </React.Fragment>
                        ))}
                        <li className="font-semibold flex justify-between pt-2">
                          <span>Total</span>
                          <span>R$ {p.total.toFixed(2)}</span>
                        </li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            {pedidosMesa.length > 0 && (
              <div className="text-right font-bold mb-4">
                Total:&nbsp; R${" "}
                {pedidosMesa.reduce((s, p) => s + p.total, 0).toFixed(2)}
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => setShowOrders(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Voltar
              </button>
              {pedidosMesa.length > 0 && (
                <button
                  onClick={handleFecharConta}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Fechar Conta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Confirmar Fechamento</h3>
            <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
              {resumoPedidos.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.name} x{it.quantity}
                  </span>
                  <span>R$ {(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="font-bold text-right mb-4">
              Total: R$ {resumoPedidos.total.toFixed(2)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Editar Pedido
              </button>
              <button
                onClick={confirmarFechamento}
                disabled={closingTab}
                className={`flex-1 text-white py-2 rounded ${
                  closingTab ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500'
                }`}
              >
                Confirmar e Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 text-center space-y-4">
            <p className="text-lg font-semibold">
              Estamos fechando sua conta. Por favor, aguarde — um atendente virá
              à sua mesa em breve para finalizar o pagamento.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-[#5d3d29] text-white px-4 py-2 rounded w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.27 12.27 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6 6l.36-.36a2 2 0 0 1 2.11-.45 12.27 12.27 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default Mesa;
