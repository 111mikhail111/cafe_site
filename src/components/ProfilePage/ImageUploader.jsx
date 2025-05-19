import { useState } from 'react';
import styles from './ImageUploader.module.css';

export default function ImageUploader({ onImageUpload }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Сохраняем файл и получаем имя
    const fileName = await saveImageToProject(file);
    onImageUpload(fileName);
  };

  const saveImageToProject = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/uploadimage', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.fileName;
  };

  return (
    <div className={styles.uploader}>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="image-upload" className={styles.uploadButton}>
        {preview ? (
          <img src={preview} alt="Preview" className={styles.preview} />
        ) : (
          'Выберите изображение'
        )}
      </label>
    </div>
  );
}