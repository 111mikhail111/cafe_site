// pages/api/reservations.js
import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ message: 'Необходим ID клиента' });
  }

  try {
    // Предполагаем, что у вас есть функция load_client_reservations(client_id)
    const { rows } = await pool.query(
      'SELECT * FROM load_client_reservations($1)',
      [clientId]
    );

    res.status(200).json(rows);
    
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.status(500).json({ 
      message: 'Ошибка при получении данных', 
      error 
    });
  }
}