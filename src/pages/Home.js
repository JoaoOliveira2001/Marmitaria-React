import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const marmitas = [
    {
      id: 1,
      name: "Marmita Executiva",
      description: "Arroz, feijão, bife grelhado, batata frita e salada",
      price: 18.9,
      image: "https://i.imgur.com/irH6zDT.png",
      rating: 4.8,
      time: "25-35 min",
    },
    {
      id: 2,
      name: "Marmita Frango",
      description: "Arroz, feijão, frango grelhado, farofa e legumes",
      price: 16.9,
      image: "https://i.imgur.com/fNkPi7U.png",
      rating: 4.9,
      time: "20-30 min",
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
    },
  ];

  const addToCart = (marmita) => {
    const existingItem = cart.find((item) => item.id === marmita.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === marmita.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...marmita, quantity: 1, observations: "" }]);
    }
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
    cart.forEach((item) => {
      message += `• ${item.name} (${item.quantity}x) - R$ ${(
        item.price * item.quantity
      ).toFixed(2)}`;

      if (item.observations && item.observations.trim()) {
        message += `\n  📝 Obs: ${item.observations}`;
      }

      message += `\n\n`;
    });
    message += `*Total: R$ ${getTotalPrice()}*\n\nPor favor, confirme meu pedido!`;

    const phoneNumber = "5511998341875"; // Substitua pelo número real
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
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
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <ShoppingCart className="inline mr-2" size={20} />
              Carrinho ({getTotalItems()})
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* 👉 Botão para Controle de Pedidos */}
            <button
              onClick={() => navigate("/controle-pedidos")}
              className="bg-white text-orange-600 px-4 py-3 rounded-full font-semibold hover:bg-orange-100 transition-all transform hover:scale-105 shadow-lg"
            >
              📋 Controle de Pedidos
            </button>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Nosso Cardápio
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
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
                            <h4 className="font-semibold">{item.name}</h4>
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

                        {/* Campo de Observações */}
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

                    <button
                      onClick={() => navigate("/Carrinho-Marmitas")}
                      className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      🛒 Continuar Pedido
                    </button>
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
    </div>
  );
};

export default Home;
