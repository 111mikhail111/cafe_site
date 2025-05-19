// pages/api/upload-image.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const multer = require('multer');
    const upload = multer({
      storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      }),
    });

    await new Promise((resolve, reject) => {
      upload.single('image')(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({ 
      fileName: `/uploads/${file.filename}` 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}