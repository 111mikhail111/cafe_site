import pool from "@/lib/db";


export default async function handler(req, res) {
    const { typeId } = req.query; // Получаем typeId из query-параметров
  
    if (!typeId) {
      return res.status(400).json({ message: 'Не указан typeId' });
    }
  
    try {
      const { rows } = await pool.query('SELECT * FROM get_kinds_by_type($1)', [typeId]);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ message: 'Ошибка при получении данных', error });
    }
  }