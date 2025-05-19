import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Вариант 1: Использование созданной функции
      // const { rows } = await pool.query('SELECT * FROM load_cafe()');

      // Вариант 2: Прямой запрос к таблице
      const { rows } = await pool.query(`
                SELECT 
                    id,
                    name,
                    city,
                    position_x as "positionX",
                    position_y as "positionY",
                    rating,
                    products,
                    delivery_time as "deliveryTime",
                    contact,
                    description
                FROM coffee_suppliers
                ORDER BY rating DESC
            `);

      // Преобразуем данные в нужный формат
      const suppliers = rows.map((row) => ({
        ...row,
        position: { x: row.positionX, y: row.positionY },
        deliveryTime: row.deliveryTime,
      }));

      res.status(200).json(suppliers);
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
      res.status(500).json({
        message: "Ошибка при получении данных",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Метод не разрешен" });
  }
}
