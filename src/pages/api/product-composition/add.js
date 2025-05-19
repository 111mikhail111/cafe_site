import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const compositions = req.body;

  if (!Array.isArray(compositions) || compositions.length === 0) {
    return res.status(401).json({ 
      message: 'Не передан массив составов продукта',
      required: ['product_id', 'ingredient_id', 'weight']
    });
  }

  try {
    // Проверяем обязательные поля в каждом элементе массива
    for (const comp of compositions) {
      if (!comp.product_id || !comp.ingredient_id || comp.weight == null) {
        return res.status(402).json({ 
          message: 'Каждый состав должен содержать product_id, ingredient_id и weight',
          invalid_item: comp
        });
      }
    }

    // Создаем массив промисов для каждого INSERT
    const insertPromises = compositions.map(comp => 
      pool.query(
        `INSERT INTO product_composition 
         (product_id, ingredient_id, weight) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
        [comp.product_id, comp.ingredient_id, comp.weight]
      )
    );

    // Выполняем все INSERT запросы
    const results = await Promise.all(insertPromises);
    
    // Получаем ID всех созданных записей
    const insertedIds = results.map(result => result.rows[0].id);

    res.status(201).json({ 
      success: true,
      message: `Успешно добавлено ${insertedIds.length} составов продукта`,
      inserted_ids: insertedIds
    });
    
  } catch (error) {
    console.error('Ошибка при добавлении состава продукта:', error);
    
    // Проверяем ошибку внешнего ключа
    if (error.code === '23503') { // Код ошибки foreign key violation
      const match = error.message.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
      return res.status(403).json({
        success: false,
        message: 'Ошибка внешнего ключа: проверьте существование product_id и ingredient_id',
        detail: match ? { key: match[1], value: match[2] } : null
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Ошибка при добавлении состава продукта',
      error: error.message
    });
  }
}