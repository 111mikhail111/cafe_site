import pool from "@/lib/db";

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  // Получаем данные из тела запроса
  const { id, name, surname, address, phone, ava, login } = req.body;

  // Валидация обязательных полей
  if (!id || !name || !phone) {
    return res.status(400).json({ 
      message: 'Не указаны все обязательные параметры',
      required: ['id', 'name', 'phone']
    });
  }

  try {
    // Вызываем хранимую процедуру обновления
    const { rows } = await pool.query(
      'CALL public.update_client($1, $2, $3, $4, $5, $6, $7)',
      [id, name, surname, address, phone, ava, login]
    );

    // Возвращаем успешный ответ
    res.status(200).json({ 
      success: true,
      message: 'Данные клиента успешно обновлены',
      client: { 
        id,
        name, 
        surname, 
        address, 
        phone, 
        ava, 
        login 
      }
    });
    
  } catch (error) {
    console.error('Ошибка при обновлении клиента:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при обновлении данных клиента',
      error: error.message
    });
  }
}