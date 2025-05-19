// pages/api/loyalty-card.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  const { clientId } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM loyalty_cards WHERE client_id = $1 AND is_active = TRUE',
        [clientId]
      );
      
      res.status(200).json({ 
        card: rows[0] || null 
      });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении карты' });
    }
  } 
  
  else if (req.method === 'POST') {
    const { clientId, cardHolder } = req.body;
    
    try {
      // Генерация номера карты и штрих-кода
      const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);
      const formattedExpiry = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).slice(-2)}`;
      const barcodeValue = `CARD${cardNumber}`;

      const { rows } = await pool.query(
        `INSERT INTO loyalty_cards 
        (client_id, card_number, card_holder_name, expiry_date, barcode_value) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [clientId, cardNumber, cardHolder, formattedExpiry, barcodeValue]
      );

      res.status(201).json({ 
        success: true, 
        card: rows[0] 
      });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании карты' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}