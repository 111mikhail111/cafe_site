// pages/api/cafe/[cafeId]/layout.js

import pool from "@/lib/db"; // Убедитесь, что путь к вашему db-коннектору верный

export default async function handler(req, res) {
  const {
    query: { cafeId }, // Получаем cafeId из динамического сегмента URL
    method,
  } = req;

  // 1. Проверяем HTTP метод
  if (method !== "GET") {
    res.setHeader('Allow', ['GET']); // Указываем разрешенный метод
    return res.status(405).json({ success: false, message: `Метод ${method} не разрешен` });
  }

  // 2. Валидация cafeId
  const id = parseInt(cafeId, 10); // Преобразуем в число
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Неверный или отсутствующий ID кафе" });
  }

  try {
    // 3. Выполняем запросы к базе данных параллельно
    // Вызываем созданные SQL функции
    const [tablesResult, plantsResult] = await Promise.all([
      pool.query("SELECT * FROM get_tables_by_cafe($1)", [id]),
      pool.query("SELECT * FROM get_plants_by_cafe($1)", [id])
    ]);

    // 4. Трансформируем данные для фронтенда
    // Преобразуем плоскую структуру из БД в структуру с вложенными объектами position и size,
    // как ожидает ваш React компонент.
    const tables = tablesResult.rows.map(t => ({
      id: t.id,
      seats: t.seats,
      position: { x: t.position_x, y: t.position_y }, // Создаем объект position
      booked: t.is_booked                            // Переименовываем is_booked в booked
    }));

    const plants = plantsResult.rows.map(p => ({
      id: p.id,
      type: p.type,
      src: p.src,
      position: { x: p.position_x, y: p.position_y }, // Создаем объект position
      size: { width: p.size_width, height: p.size_height } // Создаем объект size
    }));

    // Опционально: Проверить, существует ли кафе (если обе функции вернули пустые массивы, возможно, кафе нет)
    // В данном случае, если кафе нет или у него нет макета, просто вернется пустой layout.
    // Для явной ошибки 404 можно добавить проверку:
    // if (tables.length === 0 && plants.length === 0) {
    //    const cafeExists = await pool.query("SELECT 1 FROM cafes WHERE id = $1", [id]);
    //    if (cafeExists.rowCount === 0) {
    //        return res.status(404).json({ success: false, message: "Кафе с указанным ID не найдено" });
    //    }
    // }


    // 5. Отправляем успешный ответ
    res.status(200).json({
      success: true,
      layout: { // Группируем столы и растения под ключом 'layout'
        tables: tables,
        plants: plants
      },
    });

  } catch (error) {
    // 6. Обработка ошибок базы данных или других сбоев
    console.error(`Ошибка при получении макета для кафе ${id}:`, error);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при получении макета кафе",
      // В продакшене не стоит отправлять детальную ошибку клиенту
      // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      error: error.message, // Для примера оставляем
    });
  }
}