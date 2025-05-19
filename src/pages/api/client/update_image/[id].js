import pool from "@/lib/db";
import { upload } from "@/lib/multer";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  const {
    query: { id },
    method,
  } = req;

  const userId = id;

  // Обработка загрузки файла через multer middleware
  upload.single("image")(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "Файл слишком большой (максимум 5MB)" });
        }
        if (err.message === "Недопустимый тип файла") {
          return res.status(400).json({ message: err.message });
        }
        throw err;
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Изображение не предоставлено" });
      }

      // Обновляем аватар в базе данных
      await pool.query("UPDATE client SET ava = $1 WHERE id = $2", [
        req.file.filename,
        userId,
      ]);

      return res.status(200).json({
        id: userId,
        avatar: `/users/${req.file.filename}`,
        message: "Изображение успешно загружено",
      });
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);

      // Удаляем загруженный файл в случае ошибки
      if (req.file) {
        const filePath = path.join(
          process.cwd(),
          "public",
          "users",
          req.file.filename
        );
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Ошибка при удалении файла:", unlinkErr);
        });
      }

      return res.status(500).json({
        message: "Ошибка при загрузке изображения",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });
}
