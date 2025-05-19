import { useClient } from "@/lib/ClientContext";
import styles from "./Authorization.module.css";
import { useState } from "react";

export default function AuthorizationForm({ changeForm, closeModal }) {
  const { setClient } = useClient();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null); // Состояние для хранения ошибки
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePassChange = (e) => setPass(e.target.value);

  const fetchClientByEmail = async (email) => {
    try {
      const response = await fetch(
        `/api/client/get_by_email/${(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении данных клиента");
      }

      const data = await response.json();

      // Проверяем, что клиент найден
      if (!data || data.length === 0) {
        setError("Пользователь с данным email не зарегистрирован");
        return;
      }
      if (data[0].pass != pass) {
        setError("Вы ввели неверный пароль");
        return;
      }
      console.log('authorized client: ', data[0])
      // Сохраняем первого найденного клиента (предполагая, что email уникален)
      setClient(data[0]);
      closeModal();
      
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Произошла ошибка при авторизации");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError(null); // Сбрасываем ошибку перед новой попыткой

    try {
      // Проверяем, что email заполнен
      if (!email) {
        setError("Пожалуйста, введите email");
        return;
      }

      // Вызываем функцию поиска клиента
      await fetchClientByEmail(email);

    } catch (error) {
      setError("Пользователь с таким email не найден");
    }
  };

  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Блок для отображения ошибки */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
            <button 
              onClick={() => setError(null)} 
              className={styles.errorCloseButton}
            >
              ×
            </button>
          </div>
        )}
        
        <p className={styles.formHeading}>Войдите в ваш аккаунт</p>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Введите email"
            required
          />
          <span></span>
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="password"
            value={pass}
            onChange={handlePassChange}
            placeholder="Введите пароль"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Войти
        </button>

        <p className={styles.signupText}>
          Нет аккаунта?
          <span
            className={styles.changeForm}
            onClick={() => {
              changeForm(false);
            }}
          >
            Зарегистрироваться
          </span>
        </p>
      </form>
    </>
  );
}