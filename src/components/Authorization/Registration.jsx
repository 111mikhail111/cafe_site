import { useState } from "react";
import styles from "./Authorization.module.css";
import { useClient } from "@/lib/ClientContext";

export default function RegistrationForm({ changeForm, closeModal }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    login: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // Записываем клиента в контекст
  const { setClient } = useClient();

  const saveClientToStorageAndContext = (clientData) => {
    // Сохраняем в localStorage
    localStorage.setItem("client", JSON.stringify(clientData));
    // Обновляем контекст
    setClient(clientData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/addclient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError("Клиент с таким номером или email уже зарегистрирован");
        return;
      }

      // Получаем данные созданного клиента с сервера
      const createdClient = await response.json();
      const clientData = {
        id: createdClient.client.id, // Получаем ID из ответа сервера
        name: createdClient.client.name || formData.name,
        surname: createdClient.client.surname || "", // Добавляем фамилию, если есть
        phone: createdClient.client.phone || formData.phone,
        login: createdClient.client.login || formData.login,
        address: createdClient.client.address || "", // Добавляем адрес, если есть
        email: createdClient.client.email || "", // Добавляем email, если есть
        ava: createdClient.client.ava || "/users/default_ava.jpg",
      };

      // Сохраняем клиента
      saveClientToStorageAndContext(clientData);

      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        login: "",
        password: "",
      });
      closeModal();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
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
        <p className={styles.formHeading}>Создайте аккаунт</p>

        
        {success && (
          <div className={styles.successMessage}>
            Регистрация прошла успешно!
          </div>
        )}

        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="login"
            placeholder="Логин"
            value={formData.login}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
        <p className={styles.signupText}>
          Уже есть аккаунт?
          <div
            onClick={() => {
              changeForm(true);
            }}
            className={styles.changeForm}
          >
            Войти
          </div>
        </p>
      </form>
    </>
  );
}
