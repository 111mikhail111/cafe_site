import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const { name, phone, login, password } = req.body;

  if (!name || !phone || !login || !password) {
    return res.status(400).json({ 
      message: 'Не указаны все обязательные параметры',
      required: ['name', 'phone', 'login', 'password']
    });
  }

  try {
    // Вызываем хранимую процедуру с OUT параметром
    const { rows } = await pool.query(
      'CALL public.add_new_client($1, $2, $3, $4, NULL)', // NULL - placeholder для OUT параметра
      [name, phone, login, password]
    );
    
    // Для PostgreSQL версий < 14 можно использовать альтернативный подход:
    // const { rows } = await pool.query(
    //   'SELECT * FROM public.add_new_client($1, $2, $3, $4)',
    //   [name, phone, login, password]
    // );

    // Получаем ID созданного клиента
    const clientId = rows[0]?.client_id || rows[0]?.id;

    if (!clientId) {
      throw new Error('Не удалось получить ID созданного клиента');
    }

    res.status(201).json({ 
      success: true,
      message: 'Клиент успешно создан',
      client: { 
        id: clientId,
        name, 
        phone, 
        login 
      }
    });
    
  } catch (error) {
    console.error('Ошибка при создании клиента:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании клиента',
      error: error.message
    });
  }
}