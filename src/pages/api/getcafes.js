import pool from "@/lib/db";


export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const { rows } = await pool.query('SELECT * FROM load_cafe()');

        res.status(200).json(rows);
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ message: 'Ошибка при получении данных', error });
      }
    } else {
      res.status(405).json({ message: 'Метод не разрешен' });
    }
  }