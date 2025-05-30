import React, { useState } from 'react';
import { Clock, User, CheckCircle, AlertCircle, Package } from 'lucide-react';

const ControlePedidos = () => {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      cliente: 'Maria Silva',
      tamanho: 'Grande',
      pratoPrincipal: 'Frango Grelhado',
      acompanhamentos: ['Arroz', 'Feijão', 'Salada', 'Farofa'],
      bebida: 'Refrigerante Coca-Cola',
      observacoes: 'Sem cebola na salada, entregar às 12h',
      horaPedido: '10:30',
      status: 'pendente'
    },
    {
      id: 2,
      cliente: 'João Santos',
      tamanho: 'Média',
      pratoPrincipal: 'Bife Grelhado',
      acompanhamentos: ['Arroz', 'Batata Frita', 'Legumes'],
      bebida: 'Suco de Laranja',
      observacoes: 'Ponto da carne bem passado',
      horaPedido: '10:45',
      status: 'pendente'
    },
    {
      id: 3,
      cliente: 'Ana Costa',
      tamanho: 'Pequena',
      pratoPrincipal: 'Peixe Grelhado',
      acompanhamentos: ['Arroz', 'Feijão', 'Salada'],
      bebida: 'Sem bebida',
      observacoes: 'Pouco sal',
      horaPedido: '11:00',
      status: 'concluido'
    },
    {
      id: 4,
      cliente: 'Pedro Oliveira',
      tamanho: 'Grande',
      pratoPrincipal: 'Frango à Parmegiana',
      acompanhamentos: ['Arroz', 'Feijão', 'Batata Frita', 'Salada'],
      bebida: 'Refrigerante Guaraná',
      observacoes: 'Extra queijo na parmegiana',
      horaPedido: '11:15',
      status: 'pendente'
    }
  ]);

  const marcarComoConcluido = (id) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, status: 'concluido' } : pedido
    ));
  };

  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente');
  const pedidosConcluidos = pedidos.filter(p => p.status === 'concluido');

  const PedidoCard = ({ pedido }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      pedido.status === 'concluido' ? 'border-green-500 opacity-75' : 'border-orange-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="font-bold text-lg text-gray-800">{pedido.cliente}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{pedido.horaPedido}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-700">Tamanho:</span>
            <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm ${
              pedido.tamanho === 'Grande' ? 'bg-red-100 text-red-800' :
              pedido.tamanho === 'Média' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {pedido.tamanho}
            </div>
          </div>

          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-700">Prato Principal:</span>
            <p className="text-gray-800 font-medium">{pedido.pratoPrincipal}</p>
          </div>

          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-700">Bebida:</span>
            <p className="text-gray-800">{pedido.bebida}</p>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-700">Acompanhamentos:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {pedido.acompanhamentos.map((acomp, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  {acomp}
                </span>
              ))}
            </div>
          </div>

          {pedido.observacoes && (
            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-700">Observações:</span>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-1">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">{pedido.observacoes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {pedido.status === 'pendente' ? (
        <button
          onClick={() => marcarComoConcluido(pedido.id)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Package className="w-5 h-5" />
          Marcar como Concluído
        </button>
      ) : (
        <div className="w-full bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Pedido Concluído
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              🦉
            </div>
            <h1 className="text-2xl font-bold">Corujão Marmitas</h1>
          </div>
          <h2 className="text-xl font-semibold">Controle de Pedidos</h2>
          <p className="text-orange-100">Gerencie os pedidos da cozinha</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-500">{pedidos.length}</div>
            <div className="text-gray-600">Total de Pedidos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">{pedidosPendentes.length}</div>
            <div className="text-gray-600">Pendentes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-500">{pedidosConcluidos.length}</div>
            <div className="text-gray-600">Concluídos</div>
          </div>
        </div>

        {/* Pedidos Pendentes */}
        {pedidosPendentes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Pedidos Pendentes ({pedidosPendentes.length})
            </h3>
            <div className="space-y-4">
              {pedidosPendentes.map(pedido => (
                <PedidoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          </div>
        )}

        {/* Pedidos Concluídos */}
        {pedidosConcluidos.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Pedidos Concluídos ({pedidosConcluidos.length})
            </h3>
            <div className="space-y-4">
              {pedidosConcluidos.map(pedido => (
                <PedidoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          </div>
        )}

        {pedidos.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Os pedidos aparecerão aqui quando chegarem</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlePedidos;