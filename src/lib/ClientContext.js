// ClientContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [client, setClient] = useState(null);

  // При монтировании проверяем localStorage
  useEffect(() => {
    const savedClient = localStorage.getItem('client');
    if (savedClient) {
      setClient(JSON.parse(savedClient));
    }
  }, []);

  // Функция для обновления и сохранения
  const updateClient = (newClient) => {
    setClient(newClient);
    localStorage.setItem('client', JSON.stringify(newClient));
  };

  const updateAva = (imagePath) => {
    const updatedUser = {
      ...client,  // Копируем все существующие данные пользователя
      ava: imagePath  // Обновляем только avatar
    };
  
    // Обновляем состояние
    setClient(updatedUser);
    
    // Сохраняем в localStorage
    localStorage.setItem('client', JSON.stringify(updatedUser));
  
  }

  return (
    <ClientContext.Provider value={{ client, setClient: updateClient, updateAva }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);