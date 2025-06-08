async function enviarPedido(pedido) {
  const res = await fetch('https://script.google.com/macros/s/…/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'erro ao enviar pedido');
  return json;
}
