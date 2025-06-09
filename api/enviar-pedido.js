// api/enviar-pedido.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
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
