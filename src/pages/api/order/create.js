import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Метод не разрешен',
      allowedMethods: ['POST']
    });
  }

  const { cafeId, clientPhone, sum, employeeId } = req.body;

  // Валидация входных данных
  if (!cafeId || !clientPhone || sum === undefined || employeeId === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Не указаны все обязательные параметры',
      requiredFields: ['cafeId', 'clientPhone', 'sum', 'employeeId'],
      received: req.body
    });
  }

  try {
    // Начинаем транзакцию
    await pool.query('BEGIN');

    // 1. Создаем основной заказ
    await pool.query(
      'CALL add_new_order($1, $2, $3, $4)',
      [cafeId, clientPhone, sum, employeeId]
    );

    // 2. Получаем ID созданного заказа (последний добавленный)
    const orderResult = await pool.query(
      'SELECT id, status_id FROM orders ORDER BY id DESC LIMIT 1'
    );
    const orderId = orderResult.rows[0]?.id;
    console.log(orderResult.rows[0]?.status_id);

    if (!orderId) {
      throw new Error('Не удалось получить ID созданного заказа');
    }

    // 3. Добавляем товары в заказ (если переданы)
    if (req.body.items && Array.isArray(req.body.items)) {
      for (const item of req.body.items) {
        await pool.query(
          'CALL add_order_composition($1, $2)',
          [item.productId, item.quantity]
        );
      }
    }

    // Фиксируем транзакцию
    await pool.query('COMMIT');

   


    // Возвращаем успешный ответ
    res.status(201).json({
      success: true,
      message: 'Заказ успешно создан',
      order: {
        id: orderId,
        cafeId,
        clientPhone,
        sum,
        employeeId
      }
    });

  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query('ROLLBACK');
    
    console.error('Ошибка при создании заказа:', error);
    
    // Специфичные проверки ошибок
    if (error.message.includes('client')) {
      return res.status(404).json({
        success: false,
        message: 'Клиент с указанным телефоном не найден',
        clientPhone
      });
    }

    if (error.message.includes('cafe_id') || error.message.includes('emp_id')) {
      return res.status(404).json({
        success: false,
        message: 'Указанный ресторан или сотрудник не существует',
        cafeId,
        employeeId
      });
    }

    // Общий ответ об ошибке
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании заказа',
      error: error.message,
      details: error.detail || null
    });
  }
}