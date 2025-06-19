import { toast } from 'react-toastify';

export default async function moverMesa(mesa) {
  try {
    const response = await fetch('/api/mover-mesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa: String(mesa) }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Erro ${response.status}`);
    }

    toast.success('Mesa movida com sucesso!', {
      position: 'bottom-right',
      autoClose: 2000,
    });

    return await response.json();
  } catch (err) {
    console.error('Erro ao mover mesa:', err);
    toast.error('Falha ao mover mesa.', {
      position: 'bottom-right',
      autoClose: 2000,
    });
    return null;
  }
}
