import React, { useState } from "react";
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

const Home = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
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

  const verificarSenha = () => {
    if (senha === "marmita123") {
      localStorage.setItem("autorizado", "true");
      navigate("/controle-pedidos");
    } else {
      alert("Senha incorreta");
    }
  };

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
    {
      id: 3,
      name: "Marmita Peixe",
      description: "Arroz, feijão, peixe grelhado, purê e salada verde",
      price: 19.9,
      image:
        "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=300&h=300&fit=crop&crop=center",
      rating: 4.7,
      time: "30-40 min",
      type: "marmita",
    },
    {
      id: 4,
      name: "Marmita Vegetariana",
      description:
        "Arroz integral, feijão, proteína de soja, legumes refogados",
      price: 15.9,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop&crop=center",
      rating: 4.6,
      time: "20-30 min",
      type: "marmita",
    },
    {
      id: 5,
      name: "Marmita Premium",
      description: "Arroz, feijão tropeiro, picanha, mandioca e vinagrete",
      price: 24.9,
      image:
        "https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=300&fit=crop&crop=center",
      rating: 5.0,
      time: "35-45 min",
      type: "marmita",
    },
    {
      id: 6,
      name: "Marmita Fitness",
      description:
        "Arroz integral, feijão, peito de frango, batata doce e brócolis",
      price: 17.9,
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop&crop=center",
      rating: 4.8,
      time: "25-35 min",
      type: "marmita",
    },
  ];

  const bebidas = [
    {
      id: 7,
      name: "Coca-Cola",
      description: "Refrigerante Coca-Cola 350ml",
      price: 10.0,
      image:
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=300&fit=crop&crop=center",
      type: "bebida",
      icon: "🥤",
    },
    {
      id: 8,
      name: "Sprite",
      description: "Refrigerante Sprite 350ml",
      price: 10.0,
      image:
        "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop&crop=center",
      type: "bebida",
      icon: "🥤",
    },
    {
      id: 9,
      name: "Água",
      description: "Água mineral 500ml",
      price: 10.0,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=center",
      type: "bebida",
      icon: "💧",
    },
    {
      id: 10,
      name: "Itubaina",
      description: "Refrigerante Itubaina 350ml",
      price: 10.0,
      image: "https://via.placeholder.com/300x300/ff6b35/ffffff?text=Itubaina",
      type: "bebida",
      icon: "🥤",
    },
    {
      id: 11,
      name: "Coca-Cola Zero",
      description: "Refrigerante Coca-Cola Zero 350ml",
      price: 10.0,
      image:
        "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop&crop=center",
      type: "bebida",
      icon: "🥤",
    },
  ];

  const adicionais = [
    {
      id: 12,
      name: "Batata Frita Extra",
      description: "Porção extra de batata frita crocante",
      price: 10.0,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop&crop=center",
      type: "adicional",
      icon: "🍟",
    },
  ];

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, observations: "" }]);
    }

    // Exibe o toast de confirmação
    toast.success(`${item.name} adicionado ao carrinho!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

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
    let message = "🦉 *Pedido Corujão Marmitas*\n\n";

    message += `👤 *Cliente:* ${nome || "Não informado"}\n`;
    message += `📱 *Telefone:* ${telefone || "Não informado"}\n`;
    message += `📍 *Endereço:* ${endereco}, ${numero} - ${bairro}, ${cidade}\n`;
    if (complemento) message += `🏠 *Complemento:* ${complemento}\n`;
    if (referencia) message += `📌 *Referência:* ${referencia}\n`;
    message += `\n`;

    const marmitasInCart = cart.filter((item) => item.type === "marmita");
    const adicionaisInCart = cart.filter(
      (item) => item.type === "bebida" || item.type === "adicional"
    );

    if (marmitasInCart.length > 0) {
      message += "*🍱 Marmitas:*\n";
      marmitasInCart.forEach((item) => {
        message += `• ${item.name} (${item.quantity}x) - R$ ${(
          item.price * item.quantity
        ).toFixed(2)}`;
        if (item.observations && item.observations.trim()) {
          message += `\n  📝 Obs: ${item.observations}`;
        }
        message += `\n`;
      });
      message += `\n`;
    }

    if (adicionaisInCart.length > 0) {
      message += "*🥤 Adicionais:*\n";
      adicionaisInCart.forEach((item) => {
        message += `• ${item.name} (${item.quantity}x) - R$ ${(
          item.price * item.quantity
        ).toFixed(2)}\n`;
      });
      message += `\n`;
    }

    message += `*💳 Pagamento:* ${pagamento}`;
    if (pagamento === "Dinheiro" && troco) {
      message += ` (Troco para R$ ${troco})`;
    }
    message += `\n`;

    if (observacoes && observacoes.trim()) {
      message += `\n*📋 Observações Gerais:*\n${observacoes}`;
    }

    message += `\n\n*Total: R$ ${getTotalPrice()}*\n✅ Por favor, confirme meu pedido!`;

    const phoneNumber = "5511998341875";
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const enviarPedido = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const pedido = {
      nome,
      telefone,
      endereco: `${endereco}, ${numero} ${
        complemento ? "- " + complemento : ""
      }`,
      produtos: cart
        .map(
          (item) =>
            `${item.name} x${item.quantity}${
              item.observations ? ` (Obs: ${item.observations})` : ""
            }`
        )
        .join(" | "),
      quantidade: cart.reduce((total, item) => total + item.quantity, 0),
      total: getTotalPrice(),
      pagamento:
        pagamento === "Dinheiro" && troco
          ? `Dinheiro (Troco para R$ ${troco})`
          : pagamento,
      status: "Pendente",
      observacoes,
    };

    try {
      const response = await fetch("http://localhost:3001/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        alert("Pedido enviado com sucesso!");
      } else {
        alert("Erro ao enviar pedido.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar pedido.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🦉</div>
              <div>
                <h1 className="text-3xl font-bold">Corujão Marmitas</h1>
                <p className="text-orange-100">Sabor que conquista!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Marmitas Deliciosas</h2>
          <p className="text-xl mb-8 text-orange-100">
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu */}
          <div className="lg:w-2/3">
            {/* Marmitas Section */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              🍱 Nosso Cardápio
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {marmitas.map((marmita) => (
                <div
                  key={marmita.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="mb-2">
                        <img
                          src={marmita.image}
                          alt={marmita.name}
                          className="w-24 h-24 object-cover rounded-full mx-auto shadow-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150x150/f97316/ffffff?text=Marmita";
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {marmita.name}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-center mb-4">
                      {marmita.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-sm text-gray-600">
                          {marmita.rating}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock size={16} />
                        <span className="ml-1 text-sm">{marmita.time}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600">
                        R$ {marmita.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(marmita)}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Plus size={16} className="inline mr-1" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bebidas Section */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              🥤 Bebidas
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {bebidas.map((bebida) => (
                <div
                  key={bebida.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="mb-2">
                        <div className="text-4xl mb-2">{bebida.icon}</div>
                        <img
                          src={bebida.image}
                          alt={bebida.name}
                          className="w-20 h-20 object-cover rounded-full mx-auto shadow-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150x150/3b82f6/ffffff?text=" +
                              bebida.icon;
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {bebida.name}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-center mb-4 text-sm">
                      {bebida.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        R$ {bebida.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(bebida)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Plus size={14} className="inline mr-1" />
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionais Section */}
            {adicionais.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  🍟 Adicionais
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {adicionais.map((adicional) => (
                    <div
                      key={adicional.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <div className="mb-2">
                            <div className="text-4xl mb-2">
                              {adicional.icon}
                            </div>
                            <img
                              src={adicional.image}
                              alt={adicional.name}
                              className="w-20 h-20 object-cover rounded-full mx-auto shadow-lg"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150x150/f97316/ffffff?text=" +
                                  adicional.icon;
                              }}
                            />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {adicional.name}
                          </h3>
                        </div>

                        <p className="text-gray-600 text-center mb-4 text-sm">
                          {adicional.description}
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-orange-600">
                            R$ {adicional.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(adicional)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
                          >
                            <Plus size={14} className="inline mr-1" />
                            Comprar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🛒 Seu Pedido
              </h3>

              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">🦉</div>
                  <p>Seu carrinho está vazio</p>
                  <p className="text-sm">
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
                            <p className="text-orange-600 font-bold">
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
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      <span className="text-2xl font-bold text-orange-600">
                        R$ {getTotalPrice()}
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        Informações para Entrega
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Nome Completo"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg w-full"
                        />

                        <input
                          type="tel"
                          placeholder="Telefone"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg w-full"
                        />
                        <input
                          type="text"
                          placeholder="Endereço"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Número"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Complemento"
                          value={complemento}
                          onChange={(e) => setComplemento(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Bairro"
                          value={bairro}
                          onChange={(e) => setBairro(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Cidade"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Referência (opcional)"
                          value={referencia}
                          onChange={(e) => setReferencia(e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Forma de Pagamento
                        </label>
                        <select
                          value={pagamento}
                          onChange={(e) => setPagamento(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        onClick={sendWhatsAppOrder}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md mt-4"
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
                <div className="text-3xl">🦉</div>
                <h3 className="text-2xl font-bold">Corujão Marmitas</h3>
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
                  (11) 4002-8922
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Cabreúva, SP
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                Horário de Funcionamento
              </h4>
              <div className="text-gray-400 space-y-1">
                <p>Segunda à Sexta: 11h às 15h</p>
                <p>Sábado: 11h às 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 Corujão Marmitas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
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
            className="bg-orange-500 text-black px-4 py-2 rounded"
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
