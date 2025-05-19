import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ 
      message: 'Не указано имя напитка',
      required: ['name']
    });
  }

  try {
    // Ищем напиток по имени (точное совпадение)
    const { rows } = await pool.query(
      'SELECT id, name, price FROM product WHERE name = $1 LIMIT 1',
      [name]
    );

    if (rows.length > 0) {
      // Напиток найден
      return res.status(200).json({ 
        exists: true,
        product: rows[0]
      });
    } else {
      // Напиток не найден
      return res.status(200).json({ 
        exists: false
      });
    }
    
  } catch (error) {
    console.error('Ошибка при проверке напитка:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при проверке напитка',
      error: error.message
    });
  }
}