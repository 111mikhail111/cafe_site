import pool from "@/lib/db"; // Убедитесь, что путь к вашему db-коннектору верный

export default async function handler(req, res) {
  const {
    query: { email }, // Получаем cafeId из динамического сегмента URL
    method,
  } = req;

  if (method !== "GET") {
    res.setHeader('Allow', ['GET']); // Указываем разрешенный метод
    return res.status(405).json({ success: false, message: `Метод ${method} не разрешен` });
  }

  try {
    // 3. Выполняем запросы к базе данных параллельно
    // Вызываем созданные SQL функции
    const { rows } = await pool.query('SELECT * FROM client where login = $1', [email]);

    const usersWithAva = rows.map((user) => {
        
        if (user.ava) {
          return {
            ...user,
           
            ava: `/users/${user.ava}`,
          };
        }
        return {
            ...user,
            ava: `/users/default_ava.jpg`,
          };
      });
    // 5. Отправляем успешный ответ
    res.status(200).json(usersWithAva);

  } catch (error) {
    // 6. Обработка ошибок базы данных или других сбоев
    console.error( error);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при получении клиента",
      // В продакшене не стоит отправлять детальную ошибку клиенту
      // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      error: error.message, // Для примера оставляем
    });
  }
}
