// api/enviar-pedido.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyVHR5d-yjht3C6tW9h0qzO5W6MgdKpkm9sChEEv-ebfOuEx9IxFS_oUxbDoeNsrvuS/exec';
  try {
    const result = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const text = await result.text();
    return res.status(result.status).send(text);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao enviar pedido' });
  }
}
