import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Clock,
  Users,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceButtons, { parsePrices } from "../components/PriceButtons";

const Home = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [referencia, setReferencia] = useState("");
  const [pagamento, setPagamento] = useState("Pix");
  const [troco, setTroco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senha, setSenha] = useState("");
  const [now, setNow] = useState(new Date());
  const [allowedCardapio, setAllowedCardapio] = useState(null);
  const [cardapio1, setCardapio1] = useState([]);
  const [horarios, setHorarios] = useState({
    cardapio1: { inicio: 10, fim: 15 },
    cardapio2: { inicio: 15, fim: 22 },
  });
  const [horariosError, setHorariosError] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("retirada");
  const [localEntrega, setLocalEntrega] = useState("");
  const [frete, setFrete] = useState(0);
  // tab currently selected in the menu
  const [activeType, setActiveType] = useState("marmita");
  const cartRef = useRef(null);

  useEffect(() => {
    // Endpoint do seu Web App do Apps Script
    const url =
      "https://script.google.com/macros/s/AKfycbyYDPV06sKgZMVDEnGlih52_SNiLtQaXocYBzF37fu3rvZmdO5SVzLIo3Az9HotBE4N/exec";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // data é um array de objetos { id, name, description, price, image, time, type, Cardapio }
        const normalized = data.map((it) => ({
          ...it,
          cardapio: String(it.cardapio ?? it.Cardapio ?? ""),
        }));
        setCardapio1(normalized);
        console.log("Itens carregados:", normalized.length);
      })
      .catch((err) => {
        console.error("Falha ao carregar cardápio1:", err);
        setCardapio1([]);
      });
  }, []); // roda só uma vez, ao montar o componente

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

  const addToCart = (item) => {
    const existing = cart.find((ci) => ci.id === item.id);
    if (existing) {
      setCart(
        cart.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, observations: "" }]);
    }
    toast.success(`${item.name} adicionado ao carrinho!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const verificarSenha = () => {
    if (senha === "marmita123") {
      localStorage.setItem("autorizado", "true");
      navigate("/dashboard");
    } else {
      alert("Senha incorreta");
    }
  };

  // atualiza hora a cada minuto
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // determina qual cardápio deve ser exibido de acordo com o horário
  useEffect(() => {
    const h = now.getHours();
    let menu = null;
    const { cardapio1, cardapio2 } = horarios;
    if (h >= cardapio1.inicio && h < cardapio1.fim) menu = "1";
    else if (h >= cardapio2.inicio && h < cardapio2.fim) menu = "2";
    setAllowedCardapio(menu);
  }, [now, horarios]);

  // ajusta a aba ativa quando o cardápio muda
  useEffect(() => {
    if (allowedCardapio === "1") {
      setActiveType("marmita");
    } else if (allowedCardapio === "2") {
      setActiveType("porcao");
    }
  }, [allowedCardapio]);

  const day = now.getDay(); // 0=Dom,1=Seg,2=Ter…
  const hour = now.getHours(); // 0–23

  const removeFromCart = (id) => {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  const updateObservations = (id, observations) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, observations } : item))
    );
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const sendWhatsAppOrder = () => {
    let message = " *Pedido Orçamenthus*\n\n";

    message += ` *Cliente:* ${nome || "Não informado"}\n`;
    message += ` *Telefone:* ${telefone || "Não informado"}\n`;
    if (tipoEntrega === "entrega") {
      message += ` *Endereço:* ${endereco}, ${numero} - ${bairro}, ${cidade}\n`;
      if (complemento) message += ` *Complemento:* ${complemento}\n`;
      if (referencia) message += ` *Referência:* ${referencia}\n`;
    } else {
      message += ` *Retirada no local*\n`;
    }
    message += `\n`;

    const marmitasInCart = cart.filter((item) => item.type === "marmita");
    const porcoesInCart = cart.filter((item) => item.type === "porcao");
    const adicionaisInCart = cart.filter(
      (item) => item.type === "bebida" || item.type === "adicional"
    );

    if (marmitasInCart.length > 0) {
      message += "*Marmitas:*\n";
      marmitasInCart.forEach((item) => {
        const itemName = item.size ? `${item.name} - ${item.size}` : item.name;
        message += `• ${itemName} (${item.quantity}x) - R$ ${(
          item.price * item.quantity
        ).toFixed(2)}`;
        if (item.observations && item.observations.trim()) {
          message += `\n   Obs: ${item.observations}`;
        }
        message += `\n`;
      });
      message += `\n`;
    }

    if (porcoesInCart.length > 0) {
      message += "*Porções:*\n";
      porcoesInCart.forEach((item) => {
        const itemName = item.size ? `${item.name} - ${item.size}` : item.name;
        message += `• ${itemName} (${item.quantity}x) - R$ ${(
          item.price * item.quantity
        ).toFixed(2)}\n`;
      });
      message += `\n`;
    }

    if (adicionaisInCart.length > 0) {
      message += "*Adicionais:*\n";
      adicionaisInCart.forEach((item) => {
        const itemName = item.size ? `${item.name} - ${item.size}` : item.name;
        message += `• ${itemName} (${item.quantity}x) - R$ ${(
          item.price * item.quantity
        ).toFixed(2)}\n`;
      });
      message += `\n`;
    }

    message += `*Pagamento:* ${pagamento}`;
    if (pagamento === "Dinheiro" && troco) {
      message += ` (Troco para R$ ${troco})`;
    }
    message += `\n`;

    if (observacoes && observacoes.trim()) {
      message += `\n*Observações Gerais:*\n${observacoes}`;
    }

    message += `\n\n*Taxa de Entrega:* R$ ${frete.toFixed(2)}\n`;
    message += `*Total: R$ ${(parseFloat(getTotalPrice()) + frete).toFixed(
      2
    )}*\n Por favor, confirme meu pedido!`;

    const phoneNumber = "5511972434175";
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  // em src/pages/Home.js
  const enviarPedido = async () => {
    // 1. valida carrinho não vazio
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return false;
    }

    // 2. monta o objeto completo do pedido
    const pedido = {
      nome,
      telefone,
      endereco:
        tipoEntrega === "entrega"
          ? `${endereco}, ${numero}${complemento ? ` - ${complemento}` : ""}`
          : "Retirada",
      produtos: cart
        .map(
          (item) =>
            `${item.name} x${item.quantity}${
              item.observations ? ` (Obs: ${item.observations})` : ""
            }`
        )
        .join(" | "),
      quantidade: cart.reduce((tot, item) => tot + item.quantity, 0),
      total: getTotalPrice(),
      pagamento:
        pagamento === "Dinheiro" && troco
          ? `Dinheiro (Troco para R$ ${troco})`
          : pagamento,
      status: "Pendente",
      observacoes,
    };

    try {
      // 3. chama o endpoint proxy na Vercel em vez do Apps Script direto
      const response = await fetch("/api/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        // log de erro mais detalhado
        const text = await response.text();
        console.error("Erro ao enviar pedido:", text);
        alert("Ocorreu um erro ao enviar o pedido.");
        return false;
      }

      // 4. se chegou aqui, foi sucesso
      return true;
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível enviar o pedido. Tente novamente.");
      return false;
    }
  };

  const finalizarPedido = () => {
    sendWhatsAppOrder();
    // envio registrado em segundo plano; erros serão apenas logados
    enviarPedido().catch((err) => console.error("Erro ao enviar pedido:", err));
  };

  const camposObrigatoriosVazios = () => {
    const faltando = [];
    if (!nome.trim()) faltando.push("Nome");
    if (!telefone.trim()) faltando.push("Telefone");
    if (!pagamento) faltando.push("Forma de Pagamento");
    if (tipoEntrega === "entrega") {
      if (!endereco.trim()) faltando.push("Endereço");
      if (!numero.trim()) faltando.push("Número");
      if (!bairro.trim()) faltando.push("Bairro");
      if (!cidade.trim()) faltando.push("Cidade");
      if (!localEntrega.trim()) faltando.push("Local de Entrega");
    }
    return faltando;
  };

  const isFormularioValido = () => camposObrigatoriosVazios().length === 0;

  const handleFinalizarClick = () => {
    const faltando = camposObrigatoriosVazios();
    if (faltando.length > 0) {
      toast.error(`Preencha: ${faltando.join(", ")}`);
      return;
    }
    finalizarPedido();
  };

  // allowedCardapio é atualizado no efeito acima

  // Build the menu section based on day/time and selected tab
  let menuSection;
  if (day === 1 || !allowedCardapio) {
    menuSection = (
      <p className="text-center font-bold text-red-500">
        Estamos fechados neste horário
      </p>
    );
  } else {
    const tabs = [
      { key: "marmita", label: "Marmitas" },
      { key: "porcao", label: "Porções" },
      { key: "bebida", label: "Bebidas" },
    ];
    const filtered = cardapio1.filter(
      (item) => item.type === activeType && item.cardapio === allowedCardapio
    );
    if (filtered.length === 0) {
      console.warn("Lista vazia após filtragem", {
        hora: hour,
        activeType,
        allowedCardapio,
        totalItens: cardapio1.length,
      });
    }
    menuSection = (
      <>
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
        <div className="grid md:grid-cols-2 gap-6">
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
                <p className="text-gray-600 mb-4">{m.description}</p>
                <div className="flex justify-between items-center mb-4">
                  {m.time && <span>⏰ {m.time}</span>}
                  <span className="text-2xl font-bold text-[#5d3d29]">
                    {(() => {
                      const p = parsePrices(m.price, m);
                      if (p.length === 0) return "R$ 0.00";
                      return (
                        `R$ ${p[0].toFixed(2)}` + (p.length > 1 ? "+" : "")
                      );
                    })()}
                  </span>
                </div>
                <PriceButtons price={m.price} item={m} onAdd={addToCart} />
              </div>
            ))
          )}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff4e4]">
      {/* Header */}
      <header className="bg-[#5d3d29]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img
                src="https://i.imgur.com/wYccCFb.jpeg"
                alt="Logo Orçamenthus"
                className="w-32 h-32 object-contain rounded-full"
              />

              <div>
                <h3 className="text-3xl font-bold text-[#fff4e4]">
                  Orçamenthus
                </h3>
                <p className="text-[#5d3d29]">Sabor que conquista!</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#5d3d29] text-white shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Marmitas Deliciosas</h2>
          <p className="text-xl mb-8 text-[#5d3d29]">
            Feitas com carinho, entregues com rapidez
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Clock className="mr-2" size={16} />
              Entrega rápida
            </div>
            <div className="flex items-center">
              <Users className="mr-2" size={16} />
              +1000 clientes satisfeitos
            </div>
            <div className="flex items-center">
              <Star className="mr-2" size={16} />
              4.8 de avaliação
            </div>
          </div>
        </div>
      </section>

      {horariosError && (
        <p className="text-center text-red-500 mt-4">
          Não foi possível carregar os horários. Utilizando valores padrão.
        </p>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu */}
          <div className="lg:w-2/3">
            {/* Marmitas Section */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {allowedCardapio === "2"
                ? "🍟 Porções e Bebidas"
                : "🍱 Nosso Cardápio"}
            </h2>

            <section className="mb-12">{menuSection}</section>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:w-1/3" id="cart" ref={cartRef}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🛒 Seu Pedido
              </h3>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                  <img
                    src="https://i.imgur.com/wYccCFb.jpeg"
                    alt="Logo Orçamenthus"
                    className="w-14 h-14 object-contain rounded-full mb-4"
                  />
                  <p className="text-center font-semibold">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-sm text-center">
                    Adicione algumas marmitas deliciosas!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 p-4 rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              {item.type !== "marmita" && (
                                <span className="mr-2">{item.icon}</span>
                              )}
                              <h4 className="font-semibold">{item.name}</h4>
                            </div>
                            <p className="text-[#5d3d29] font-bold">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="mx-2 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {item.type === "marmita" && (
                          <div className="w-full">
                            <div className="flex items-center mb-2">
                              <MessageSquare
                                size={14}
                                className="text-gray-500 mr-1"
                              />
                              <label className="text-sm text-gray-600 font-medium">
                                Observações:
                              </label>
                            </div>
                            <textarea
                              value={item.observations || ""}
                              onChange={(e) =>
                                updateObservations(item.id, e.target.value)
                              }
                              placeholder="Ex: sem cebola, caprichar no tempero..."
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5d3d29] focus:border-transparent"
                              rows="2"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-[#5d3d29]">
                        R$ {(parseFloat(getTotalPrice()) + frete).toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#5d3d29]" />
                        Informações para Entrega
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">Campos marcados com <span className="text-red-500">*</span> são obrigatórios.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Nome Completo *"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                          className="p-3 border border-gray-300 rounded-lg w-full"
                        />

                        <input
                          type="tel"
                          placeholder="Telefone *"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          required
                          className="p-3 border border-gray-300 rounded-lg w-full"
                        />

                        {/* Tipo de entrega: retirada ou entrega */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Entrega ou Retirada?
                          </label>
                          <select
                            value={tipoEntrega}
                            onChange={(e) => {
                              const tipo = e.target.value;
                              setTipoEntrega(tipo);
                              if (tipo === "retirada") {
                                setFrete(0);
                                setLocalEntrega("");
                              }
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                          >
                            <option value="retirada">Retirada</option>
                            <option value="entrega">Entrega</option>
                          </select>
                        </div>

                        {/* Campos de endereço */}
                        {tipoEntrega === "entrega" && (
                          <>
                            <input
                              type="text"
                              placeholder="Endereço *"
                              value={endereco}
                              onChange={(e) => setEndereco(e.target.value)}
                              required
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                            />
                            <input
                              type="text"
                              placeholder="Número *"
                              value={numero}
                              onChange={(e) => setNumero(e.target.value)}
                              required
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                            />
                            <input
                              type="text"
                              placeholder="Complemento"
                              value={complemento}
                              onChange={(e) => setComplemento(e.target.value)}
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                            />
                            <input
                              type="text"
                              placeholder="Bairro *"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value)}
                              required
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                            />
                            <input
                              type="text"
                              placeholder="Cidade *"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              required
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                            />
                            <input
                              type="text"
                              placeholder="Referência (opcional)"
                              value={referencia}
                              onChange={(e) => setReferencia(e.target.value)}
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                            />

                            {/* Local de entrega */}
                            <div className="mt-4">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Local de Entrega <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={localEntrega}
                                required
                                onChange={(e) => {
                                  const local = e.target.value;
                                  setLocalEntrega(local);
                                  if (local === "pinhal") setFrete(10);
                                  else if (local === "jacare") setFrete(4);
                                  else if (local === "cabreuva") setFrete(20);
                                  else if (local === "vilareijo") setFrete(5);
                                  else if (local === "cai") setFrete(10);
                                  else if (local === "condominio") setFrete(8);
                                  else if (local === "cururu") setFrete(7);
                                  else if (local === "colina") setFrete(4);
                                  else if (local === "bonfim") setFrete(6);
                                  else if (local === "novo") setFrete(6);
                                  else setFrete(0);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                              >
                                <option value="">Selecione</option>
                                <option value="pinhal">
                                  Pinhal - R$ 10,00
                                </option>
                                <option value="vilareijo">
                                  Vilareijo - R$ 5,00
                                </option>
                                <option value="condominio">
                                  Condominio - R$ 8,00
                                </option>
                                <option value="cururu">Cururu - R$ 7,00</option>
                                <option value="colina">Colina - R$ 4,00</option>
                                <option value="jacare">Jacaré - R$ 4,00</option>
                                <option value="cai">Caí - R$ 10,00</option>
                                <option value="bonfim">Bonfim - R$ 6,00</option>
                                <option value="cabreuva">
                                  Cabreúva - R$ 20,00
                                </option>
                              </select>
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Forma de Pagamento <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={pagamento}
                          onChange={(e) => setPagamento(e.target.value)}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                        >
                          <option value="Pix">Pix</option>
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Cartão">Cartão</option>
                        </select>
                      </div>

                      {pagamento === "Dinheiro" && (
                        <input
                          type="text"
                          placeholder="Troco para quanto?"
                          value={troco}
                          onChange={(e) => setTroco(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                        />
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Observações Gerais
                        </label>
                        <textarea
                          placeholder="Ex: tocar a campainha, entregar na portaria..."
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          rows="3"
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5d3d29]"
                        />
                      </div>

                      {camposObrigatoriosVazios().length > 0 && (
                        <p className="text-sm text-red-500 mt-2">
                          Preencha: {camposObrigatoriosVazios().join(', ')}.
                        </p>
                      )}

                      <button
                        onClick={handleFinalizarClick}
                        disabled={!isFormularioValido()}
                        className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md mt-4 ${
                          !isFormularioValido() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Phone className="w-5 h-5" />
                        Finalizar Pedido
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://i.imgur.com/wYccCFb.jpeg"
                  alt="Logo Orçamenthus"
                  className="w-32 h-32 object-contain rounded-full"
                />
                <h3 className="text-2xl font-bold">Orçamenthus</h3>
              </div>
              <p className="text-gray-400">
                Marmitas saborosas e nutritivas, preparadas com ingredientes
                frescos e muito carinho.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  +55 11 97243-4175
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Cabreúva, SP
                </div>
                <a
                  href="https://wa.me/5511998836070"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#5d3d29] rounded text-white"
                >
                  <MessageSquare className="w-4 h-4" /> Gostou do site ? Chama
                  ai !
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4"></h4>
              <h1>🕒 Horário de Funcionamento</h1>
              <div className="text-gray-400 space-y-1">
                <p>Terça a Domingo</p>
                <p>⏰ 10h às 14h – Marmitas (cardápio 1)</p>
                <p>⏰ 15h às 22h – Porções, bebidas, etc. (cardápio 2)</p>
                <p>❌ Fechado às segundas-feiras</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 Orçamenthus. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {cart.length > 0 && (
        <button
          onClick={() =>
            cartRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="md:hidden fixed bottom-4 right-4 bg-[#5d3d29] hover:bg-[#5d3d29] text-white font-semibold py-3 px-4 rounded-full flex items-center gap-2 shadow-lg z-50"
        >
          <ShoppingCart className="w-5 h-5" />
          Ver Carrinho
        </button>
      )}
      <ToastContainer />

      {!mostrarSenha ? (
        <button
          onClick={() => setMostrarSenha(true)}
          className="bg-blue-1000 text-black px-4 py-2 rounded"
        >
          📋 Controle de Pedidos
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="p-2 rounded border"
          />
          <button
            onClick={verificarSenha}
            className="bg-[#5d3d29] text-black px-4 py-2 rounded"
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
