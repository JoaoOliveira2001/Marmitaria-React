export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    const url = 'https://script.google.com/macros/s/AKfycbxdcoAL93G0U2KBit0pww3582MFP-9eWh3kcizq-f2rBR7YVtrQg-N6Wneh99zxZYB6/exec';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('Erro na resposta do Apps Script:', text);
      return res.status(500).send(text);
    }

    try {
      res.status(200).json(JSON.parse(text));
    } catch {
      res.status(200).send(text);
    }
  } catch (error) {
    console.error('Erro ao encaminhar requisicao:', error);
    res
      .status(500)
      .json({ error: 'Erro interno ao chamar Apps Script', details: error.message });
  }
}
