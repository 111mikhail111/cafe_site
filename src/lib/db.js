import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Используйте переменную окружения
  ssl: {
    rejectUnauthorized: false, // Обязательно для Neon!
  },
});

export default pool;
