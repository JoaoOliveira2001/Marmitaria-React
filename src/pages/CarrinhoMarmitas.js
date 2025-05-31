import React, { useState } from 'react';
import { Plus, Minus, MapPin, User, Phone, Clock, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const CarrinhoMarmitas = () => {
      const navigate = useNavigate();

  const [mostrarEntrega, setMostrarEntrega] = useState(false);
  const [dadosEntrega, setDadosEntrega] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    referencia: '',
    formaPagamento: 'dinheiro',
    troco: '',
    observacoes: ''
  });

  const [itensCarrinho, setItensCarrinho] = useState([
    {
      id: 1,
      nome: 'Marmita Frango',
      preco: 16.90,
      quantidade: 1,
      observacoes: 'Ex: sem cebola, caprichar no tempero...'
    },
    {
      id: 2,
      nome: 'Marmita Vegetariana',
      preco: 15.90,
      quantidade: 1,
      observacoes: 'Ex: sem cebola, caprichar no tempero...'
    }
  ]);
           
  const alterarQuantidade = (id, operacao) => {
    setItensCarrinho(itens => 
      itens.map(item => {
        if (item.id === id) {
          const novaQuantidade = operacao === 'aumentar' 
            ? item.quantidade + 1 
            : Math.max(1, item.quantidade - 1);
          return { ...item, quantidade: novaQuantidade };
        }
        return item;
      })
    );
  };

  const calcularTotal = () => {
    return itensCarrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const handleInputChange = (campo, valor) => {
    setDadosEntrega(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const finalizarPedido = () => {
    // Aqui você pode integrar com WhatsApp ou enviar para seu backend
    const pedidoCompleto = {
      itens: itensCarrinho,
      total: calcularTotal(),
      entrega: dadosEntrega
    };
    
    console.log('Pedido finalizado:', pedidoCompleto);
    
    // Exemplo de integração com WhatsApp
    const mensagem = criarMensagemWhatsApp(pedidoCompleto);
    const numeroWhatsApp = '5511999999999'; // Substitua pelo seu número
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const criarMensagemWhatsApp = (pedido) => {
    let mensagem = '🍱 *NOVO PEDIDO - CORUJÃO MARMITAS*\n\n';
    
    mensagem += '*📋 ITENS DO PEDIDO:*\n';
    pedido.itens.forEach(item => {
      mensagem += `• ${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
      if (item.observacoes) {
        mensagem += `  _Obs: ${item.observacoes}_\n`;
      }
    });
    
    mensagem += `\n*💰 TOTAL: R$ ${pedido.total.toFixed(2)}*\n\n`;
    
    mensagem += '*📍 DADOS DE ENTREGA:*\n';
    mensagem += `Nome: ${pedido.entrega.nome}\n`;
    mensagem += `Telefone: ${pedido.entrega.telefone}\n`;
    mensagem += `Endereço: ${pedido.entrega.endereco}, ${pedido.entrega.numero}\n`;
    if (pedido.entrega.complemento) mensagem += `Complemento: ${pedido.entrega.complemento}\n`;
    mensagem += `Bairro: ${pedido.entrega.bairro}\n`;
    mensagem += `Cidade: ${pedido.entrega.cidade}\n`;
    if (pedido.entrega.referencia) mensagem += `Referência: ${pedido.entrega.referencia}\n`;
    
    mensagem += `\n*💳 PAGAMENTO:* ${pedido.entrega.formaPagamento}`;
    if (pedido.entrega.formaPagamento === 'dinheiro' && pedido.entrega.troco) {
      mensagem += ` (Troco para R$ ${pedido.entrega.troco})`;
    }
    
    if (pedido.entrega.observacoes) {
      mensagem += `\n\n*📝 OBSERVAÇÕES:*\n${pedido.entrega.observacoes}`;
    }
    
    return mensagem;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Header do Carrinho */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          🛒
        </div>
        <h2 className="text-xl font-bold text-gray-800">Seu Pedido</h2>
      </div>

      {/* Itens do Carrinho */}
      <div className="space-y-4 mb-6">
        {itensCarrinho.map(item => (
          <div key={item.id} className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{item.nome}</h3>
              <span className="font-bold text-orange-500">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button 
                  onClick={() => alterarQuantidade(item.id, 'diminuir')}
                  className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                >
                  <Minus className="w-4 h-4 text-red-500" />
                </button>
                <span className="px-4 py-2 font-semibold">{item.quantidade}</span>
                <button 
                  onClick={() => alterarQuantidade(item.id, 'aumentar')}
                  className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-green-500" />
                </button>
              </div>
            </div>

            <div className="mt-2">
              <label className="text-sm text-gray-600">Observações:</label>
              <textarea 
                className="w-full mt-1 p-2 border border-gray-200 rounded text-sm resize-none"
                rows="2"
                placeholder={item.observacoes}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="text-orange-500">R$ {calcularTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Botão Principal */}
      <button
        onClick={() => setMostrarEntrega(!mostrarEntrega)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
      >
        <MapPin className="w-5 h-5" />
        {mostrarEntrega ? 'Ocultar Dados de Entrega' : 'Confirmar Pedido'}
        {mostrarEntrega ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Formulário de Entrega - Expansível */}
      <div className={`overflow-hidden transition-all duration-300 ${
        mostrarEntrega ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-orange-500" />
            Dados de Entrega
          </h3>

          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nome Completo *
              </label>
              <input
                type="text"
                value={dadosEntrega.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone *
              </label>
              <input
                type="tel"
                value={dadosEntrega.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
              <input
                type="text"
                value={dadosEntrega.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Rua, Avenida..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
              <input
                type="text"
                value={dadosEntrega.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input
                type="text"
                value={dadosEntrega.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Apt, Casa, Bloco..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                <input
                  type="text"
                  value={dadosEntrega.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Seu bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input
                  type="text"
                  value={dadosEntrega.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Sua cidade"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ponto de Referência</label>
              <input
                type="text"
                value={dadosEntrega.referencia}
                onChange={(e) => handleInputChange('referencia', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Próximo ao mercado, em frente à farmácia..."
              />
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Forma de Pagamento *
            </label>
            <select
              value={dadosEntrega.formaPagamento}
              onChange={(e) => handleInputChange('formaPagamento', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão na Entrega</option>
              <option value="pix">PIX</option>
            </select>

            {dadosEntrega.formaPagamento === 'dinheiro' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={dadosEntrega.troco}
                  onChange={(e) => handleInputChange('troco', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Precisa de troco? Ex: R$ 50,00"
                />
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
            <textarea
              value={dadosEntrega.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Alguma observação especial sobre o pedido ou entrega..."
            />
          </div>

          {/* Botão Finalizar */}
          <button
            onClick={finalizarPedido}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
          >
            <Phone className="w-5 h-5" />
            Finalizar no WhatsApp
          </button>
           <button
              onClick={() => navigate("/Home ")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
            >
              ◀️ Voltar Menu Inicial
            </button>
        </div>
      </div>
    </div>
  );
};

export default CarrinhoMarmitas;