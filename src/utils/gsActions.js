const API_URL = '/api/gs-router';

async function callGs(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Erro ${response.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function enviarPedido(data) {
  return callGs({ acao: 'salvarPedido', ...data });
}

export async function salvarPedidoMesa(data) {
  return callGs({ acao: 'salvarPedidoMesa', ...data });
}

export async function fecharContaMesa(mesa) {
  return callGs({ acao: 'fecharConta', mesa });
}

export async function moverParaFecharConta(mesa) {
  return callGs({ acao: 'moverParaFecharConta', mesa });
}

export async function liberarMesa(mesa) {
  const response = await fetch('/api/limpaMesa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mesa }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Erro ${response.status}`);
  }

  try {
    const data = JSON.parse(text);
    if (data.success !== true) {
      throw new Error('Operacao falhou');
    }
    return data;
  } catch {
    return text;
  }
}

export default {
  enviarPedido,
  salvarPedidoMesa,
  fecharContaMesa,
  moverParaFecharConta,
  liberarMesa,
};
