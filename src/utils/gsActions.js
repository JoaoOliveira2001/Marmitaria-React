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
  const url =
    'https://script.google.com/macros/s/AKfycbw3q0WCN1EO2A6bS5no9-71AutpAOLpS6L1yNFxetwGcNxdd-Fx92vPZpzRxKwSCT1g/exec';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ acao: 'limparMesa', mesa }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erro ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Operacao falhou');
  }

  return data;
}

export default {
  enviarPedido,
  salvarPedidoMesa,
  fecharContaMesa,
  moverParaFecharConta,
  liberarMesa,
};
