'use client';
import { useClient } from '@/lib/ClientContext';
import { useState, useRef } from 'react';

import { FiLoader } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";

const ImageUploadButton = () => {
  const { client, updateAva } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.match('image.*')) {
      setError('Пожалуйста, выберите файл изображения');
      return;
    }

    // Проверка размера файла (не более 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`/api/client/update_image/${client.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const updatedUser = await response.json();
      updateAva(updatedUser.avatar);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      <button 
        className="upload-button" 
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <FiLoader className="spinner" style={{ color: 'var(--foreground)' }} />
        ) : (
          <MdModeEdit className="icon" style={{ color: 'var(--foreground)' }} />
        )}
      </button>
  
      <style jsx>{`
        .image-upload-container {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
        }
        
        .upload-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background-color: var(--light);
          color: white;
          border: 2px solid var(--dark);
          border-radius: 50%;
          cursor: pointer;
          width: 32px;
          height: 32px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .upload-button:hover {
          transform: scale(1.05);
        }
        
        .upload-button:disabled {
          background-color: var(--lighten);
          cursor: not-allowed;
        }
        
        .icon {
          width: 16px;
          height: 16px;
          color: var(--foreground);
        }
        
        .spinner {
          animation: spin 1s linear infinite;
          width: 16px;
          height: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ImageUploadButton;