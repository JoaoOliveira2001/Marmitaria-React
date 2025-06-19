const API_URL = '/api/gs-router';
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw3q0WCN1EO2A6bS5no9-71AutpAOLpS6L1yNFxetwGcNxdd-Fx92vPZpzRxKwSCT1g/exec';

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

export async function fecharContaMesa(mesa) {
  const payload = { acao: 'moverParaFecharConta', mesa: String(mesa) };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.success !== true) {
      throw new Error(data.message || `Erro ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error('Erro ao fechar conta:', err);
    throw err;
  }
}

export async function enviarPedido(data) {
  return callGs({ acao: 'salvarPedido', ...data });
}

export async function salvarPedidoMesa(data) {
  return callGs({ acao: 'salvarPedidoMesa', ...data });
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
