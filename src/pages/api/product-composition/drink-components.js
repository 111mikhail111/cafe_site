import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Получаем все компоненты из базы
    const { rows } = await pool.query(`
      SELECT drink_constructor.id, ingredient_id, ingredient.name, image_path as image, color, constructor_type as type
      FROM drink_constructor
	  inner join ingredient on ingredient.id = drink_constructor.ingredient_id
      ORDER BY constructor_type, id
    `);

    // Группируем по типам
    const components = {
      bases: rows.filter(item => item.type === 'base'),
      additives: rows.filter(item => item.type === 'additive'),
      toppings: rows.filter(item => item.type === 'top')
    };

    res.status(200).json(components);
  } catch (error) {
    console.error('Error fetching drink components:', error);
    res.status(500).json({ 
      message: 'Error fetching drink components',
      error: error.message 
    });
  }
}