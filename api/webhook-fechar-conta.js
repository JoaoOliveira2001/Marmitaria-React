export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const url = 'http://145.223.31.139:5678/webhook/fecharConta';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).send(text);
    }

    res.status(200).send(text);
  } catch (error) {
    console.error('Erro ao enviar dados ao webhook:', error);
    res.status(500).json({ error: 'Erro interno ao chamar webhook', details: error.message });
  }
}
