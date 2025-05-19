import multer from "multer";
import { v4 } from 'uuid'; 
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'users');
    // Создаем директорию, если она не существует
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${v4()}${ext}`); // Используем v4 напрямую
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Недопустимый тип файла"), false);
    }
  },
});
