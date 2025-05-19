import React, { useState, useEffect } from "react";
import styles from "./LoyaltyCard.module.css";
import Barcode from "react-barcode";
import { Modal } from "../UI/Modal";// Предполагается, что у вас есть компонент модального окна

const LoyaltyCard = ({ clientId }) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [hasLoyaltyCard, setHasLoyaltyCard] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [formData, setFormData] = useState({
    cardHolder: "",
    acceptTerms: false
  });

  // Загрузка данных карты при монтировании компонента
  useEffect(() => {
    const fetchLoyaltyCard = async () => {
      try {
        const response = await fetch(`/api/loyalty-card?clientId=${clientId}`);
        const data = await response.json();
        
        if (data.card) {
          setCardData(data.card);
          setHasLoyaltyCard(true);
        }
      } catch (error) {
        console.error("Ошибка при загрузке карты лояльности:", error);
      }
    };

    if (clientId) {
      fetchLoyaltyCard();
    }
  }, [clientId]);

  const handleCardClick = () => {
    if (hasLoyaltyCard) {
      setIsCardFlipped(!isCardFlipped);
    }
  };

  const handleCreateCard = () => {
    setIsCreatingCard(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/loyalty-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          cardHolder: formData.cardHolder
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCardData(data.card);
        setHasLoyaltyCard(true);
        setIsCreatingCard(false);
      }
    } catch (error) {
      console.error("Ошибка при создании карты:", error);
    }
  };

  if (!hasLoyaltyCard) {
    return (
      <div className={styles.noCardContainer}>
        <div className={styles.noCardMessage}>
          <h3>У вас пока нет карты лояльности</h3>
          <p>Зарегистрируйте карту, чтобы начать копить бонусы</p>
          <button 
            className={styles.createCardButton}
            onClick={handleCreateCard}
          >
            Создать карту лояльности
          </button>
        </div>

        <Modal isOpen={isCreatingCard} onClose={() => setIsCreatingCard(false)}>
          <div className={styles.createCardModal}>
            <h2>Создание карты лояльности</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="cardHolder">Имя на карте:</label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroupCheckbox}>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="acceptTerms">
                  Я согласен с условиями программы лояльности
                </label>
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={!formData.acceptTerms}
              >
                Создать карту
              </button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }

  // Форматирование данных карты
  const formattedCardNumber = cardData.card_number.match(/.{1,4}/g).join(" ");
  const expiryDate = cardData.expiry_date;

  return (
    <div className={styles.loyaltyCardContainer}>
      <div
        className={`${styles.loyaltyCard} ${
          isCardFlipped ? styles.flipped : ""
        }`}
        onClick={handleCardClick}
      >
        <div className={styles.cardFront}>
          <p>Карта лояльности клиента.</p>
          <p>Для большей информации нажмите.</p>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.cardHeader}>
            <img
              src="https://avatars.mds.yandex.net/get-altay/11356085/2a0000019285af1e1dae4b2078e482126bfe/orig"
              alt="Логотип компании"
              className={styles.cardLogo}
            />
            <div className={styles.cardType}>Loyalty Card</div>
          </div>

          <div className={styles.cardNumber}>{formattedCardNumber}</div>
          <div className={styles.cardHolderName}>{cardData.card_holder_name}</div>

          <div className={styles.cardDetails}>
            <div className={styles.expiry}>
              <span className={styles.detailLabel}>Expires</span>
              <span className={styles.detailValue}>{expiryDate}</span>
            </div>
            <div className={styles.points}>
              <span className={styles.detailLabel}>Points</span>
              <span className={styles.detailValue}>{cardData.points}</span>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <p>Спасибо, что вы с нами!</p>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default LoyaltyCard;