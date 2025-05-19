import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ 
      message: 'Не указано имя напитка или его описание',
      required: ['name', 'description']
    });
  }

  const recept = "Специальный рецепт";
  const shelfDate = 365; // Пример: срок годности 1 год
  const weight = 300; // Пример: вес в граммах

  try {
    // Правильный вызов процедуры
    const { rows } = await pool.query(
      `call public.add_product($1, 350, $2, $3, $4, $5, 2, null, null)`,
      [name, shelfDate, weight, description, recept]
    );

    // Получаем ID из выходного параметра
    const productId = rows[0]?.product_id;

    console.log(productId);

    if (!productId) {
      throw new Error('Не удалось получить ID созданного продукта');
    }

    res.status(201).json({ 
      success: true,
      message: 'Продукт успешно создан',
      product: { 
        id: productId,
        name: name,
        description: description
      }
    });
    
  } catch (error) {
    console.error('Ошибка при создании напитка:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании напитка',
      error: error.message
    });
  }
}