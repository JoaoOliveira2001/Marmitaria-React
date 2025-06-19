export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const url = 'https://script.google.com/macros/s/AKfycbz-vrgnernNri7aEAisTo36S3djpVF5zzt6alAW5HsmnkBA8h0DYyHEpIMLNqDNthRe/exec';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({ error: text });
    }

    try {
      res.status(200).json(JSON.parse(text));
    } catch {
      res.status(200).send(text);
    }
  } catch (error) {
    console.error('Erro ao mover mesa:', error);
    res.status(500).json({ error: error.message });
  }
}
