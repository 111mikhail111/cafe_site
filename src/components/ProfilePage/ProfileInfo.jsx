import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css"; 
import LoyaltyCard from "./LoyaltyCard"; 
import OrderHistory from "./OrderHistory"; 
import UiButton from "../UI/UiButton";
import { Modal } from "../UI/Modal";
import AuthorizationForm from "../Authorization/Authorization";
import RegistrationForm from "../Authorization/Registration";
import { useClient } from "@/lib/ClientContext";
import { Pencil } from "lucide-react";
import ImageUploader from "./ImageUploader";
import UserReservations from "./Reservations";
import OrderModal from "./OrderModal";
import ImageUploadButton from "../UI/SaveImageButton";

const Profile = ({ setIsLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  const { client, setClient } = useClient();
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const [userData, setUserData] = useState({
    avatar:
      "https://i.pinimg.com/736x/d0/cf/a8/d0cfa8b3f2b9aa687e99cdd88bb82f10.jpg",
    firstName: "Иван",
    lastName: "Иванов",
    email: "ivan.ivanov@example.com",
    phone: "+7 (999) 123-45-67",
    address: "Москва, ул. Ленина, 1",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    if (client != null) {
      
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `/api/order/get_from_client/${client.id}`
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Ошибка при получении заказов");
          }

          setOrderHistory(data.orders); 
        } catch (err) {
          console.error("Ошибка:", err);
          setOrderHistory([]);
        }
      };

      fetchOrders();
    }
  }, [client]);

  useEffect(() => {
    if (client == null) {
      setIsLoading(false);
    }
    if (orderHistory && client) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); 


      return () => clearTimeout(timer);
    }
  }, [orderHistory, client]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Данные профиля обновлены:", userData);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const IfNotAuth = () => {
    return (
      <div className={styles.ifNotAuthText}>
        Для просмотра сведений{" "}
        <span
          onClick={() => {
            {
              setIsAuth(true);
              setIsModalOpen(true);
            }
          }}
          className={styles.ifNotAuthLink}
        >
          войдите
        </span>{" "}
        в свой аккаунт или{" "}
        <span
          onClick={() => {
            {
              setIsAuth(false);
              setIsModalOpen(true);
            }
          }}
          className={styles.ifNotAuthLink}
        >
          зарегистрируйтесь
        </span>
      </div>
    );
  };

  const updateClient = async () => {
    try {
      const response = await fetch("/api/editclient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: client.id,
          name: client.name,
          surname: client.surname,
          address: client.address,
          phone: client.phone,
          ava: client.ava,
          login: client.login,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Данные обновлены:", data.client);
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const logout = () => {
    setClient(null);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.profileContainer}>
        {client ? (
          <div>
            <div className={styles.profileHeader}>
              <div className={styles.avaCont}>
                <img
                  src={client.ava ? client.ava : "/team-1.jpg"}
                  alt="Аватар"
                  className={styles.avatar}
                ></img>
                <ImageUploadButton />
              </div>

              <h1>Профиль пользователя</h1>
              <UiButton className={styles.logout} onClick={() => logout()}>
                Выйти из аккаунта
              </UiButton>
            </div>
            <div className={styles.profileDetails}>
              {isEditing ? (
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <label htmlFor="name">Имя:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={client.name}
                    onChange={handleChange}
                  />

                  <label htmlFor="surname">Фамилия:</label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={client.surname}
                    onChange={handleChange}
                  />

                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={client.login}
                    onChange={handleChange}
                  />

                  <label htmlFor="phone">Телефон:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={client.phone}
                    onChange={handleChange}
                  />

                  <UiButton
                    variant="outline"
                    className={`${styles.editBtn} ${styles.btn}`}
                    type="submit"
                    onClick={() => {
                      updateClient();
                    }}
                  >
                    Сохранить
                  </UiButton>
                  <UiButton
                    variant="outline"
                    type="button"
                    className={styles.btn}
                    onClick={() => setIsEditing(false)}
                  >
                    Отмена
                  </UiButton>
                </form>
              ) : (
                <div className={styles.profileInfo}>
                  <p>
                    <strong>Имя:</strong> {client.name} {client.surname}
                  </p>
                  <p>
                    <strong>Email:</strong> {client.login}
                  </p>
                  <p>
                    <strong>Телефон:</strong> {client.phone}
                  </p>

                  <UiButton
                    variant="outline"
                    className={styles.btn}
                    onClick={handleEditClick}
                  >
                    Редактировать
                  </UiButton>
                </div>
              )}
            </div>
            <LoyaltyCard clientId={client.id} />{" "}
            {/* Компонент карты лояльности */}
            <div className={styles.orderHistorySection}>
              <h2 className={styles.orderHistoryH2Header}>История заказов</h2>
              <OrderHistory
                orders={orderHistory}
                onOrderClick={(order) => {
                  setCurrentOrder(order);
                  setIsOrderModalOpen(true);
                }}
              />{" "}
              {/* Компонент истории заказов */}
            </div>
            <UserReservations clientId={client.id} />
            {isOrderModalOpen ? (
              <OrderModal
                onClose={() => setIsOrderModalOpen(false)}
                order={currentOrder}
              />
            ) : null}
          </div>
        ) : (
          <IfNotAuth />
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Пример модалки"
        >
          {isAuth ? (
            <AuthorizationForm
              changeForm={setIsAuth}
              closeModal={() => {
                setIsModalOpen(false);
              }}
            />
          ) : (
            <RegistrationForm
              changeForm={setIsAuth}
              closeModal={() => {
                setIsModalOpen(false);
              }}
            />
          )}
        </Modal>
      </div>
    </main>
  );
};

export default Profile;
