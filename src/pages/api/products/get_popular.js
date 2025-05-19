import pool from "@/lib/db";


export default async function handler(req, res) {
    
  
    
  
    try {
      const { rows } = await pool.query('SELECT * FROM get_top_7_popular_products()');
      const productsWithBase64 = rows.map((product) => {
        if (product.image_url) {
          const base64Image = Buffer.from(product.image_url).toString('base64');
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