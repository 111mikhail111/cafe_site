import pool from "@/lib/db";


export default async function handler(req, res) {
    const { kindId, cafeId } = req.query; // Получаем typeId из query-параметров
  
    if (!kindId) {
      return res.status(400).json({ message: 'Не указан prodId' });
    }
  
    try {
      const { rows } = await pool.query('SELECT * FROM get_products_from_cafe_by_kind($1, $2)', [cafeId, kindId]);
      const productsWithBase64 = rows.map((product) => {
        if (product.image) {
          const base64Image = Buffer.from(product.image).toString('base64');
          return {
            ...product,
            image_url: `data:image/jpeg;base64,${base64Image}`, // Укажите правильный MIME-тип (например, image/jpeg, image/png)
          };
        }
        return product;
      });
  
      res.status(200).json(productsWithBase64);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      res.status(500).json({ message: 'Ошибка при получении данных', error });
    }
  }