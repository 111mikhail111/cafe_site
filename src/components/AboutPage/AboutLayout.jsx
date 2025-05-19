import React, { useEffect, useState } from "react";
import { Clock, MapPin, Coffee, Heart, Users, Award } from "lucide-react";
import styles from "./AboutLayout.module.css";
import Link from "next/link";

export default function AboutLayout() {
  const [cafes, setCafes] = useState(null);

  useEffect(() => {
    fetch("/api/getcafes")
      .then((response) => response.json())
      .then((data) => setCafes(data));
  }, []);
  return (
    <div className={styles.aboutPage}>
      {/* Герой-секция */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>404 coffee</h1>
          <p className={styles.heroSubtitle}>Место, где рождается вкус</p>
          <div className={styles.heroDivider}></div>
        </div>
      </section>

      {/* Основной контент */}
      <div className={styles.container}>
        {/* О нас */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>Наша история</h2>

              <p>
                Coffee House открыл свои двери в 2010 году с простой миссией -
                дарить людям настоящий вкус качественного кофе. За эти годы мы
                превратились из маленькой кофейни в любимое место ценителей кофе
                по всему городу.
              </p>
              <p>
                Наша философия - это внимание к деталям на каждом этапе: от
                выбора зерен до момента подачи напитка. Мы сотрудничаем напрямую
                с фермерами из Эфиопии, Колумбии и Бразилии, чтобы предложить
                вам лучшие сорта.
              </p>
            </div>
            <div className={styles.aboutImage}>
              <img src="/about-coffee.png" alt="Наша кофейня" />
            </div>
          </div>
        </section>

        {/* Наши преимущества */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Почему выбирают нас</h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <Coffee className={styles.featureIcon} />
              <h3>Авторские рецепты</h3>
              <p>Уникальные кофейные напитки, созданные нашими бариста</p>
            </div>

            <div className={styles.featureCard}>
              <Heart className={styles.featureIcon} />
              <h3>Только натуральное</h3>
              <p>Используем 100% арабику без искусственных добавок</p>
            </div>

            <div className={styles.featureCard}>
              <Users className={styles.featureIcon} />
              <h3>Профессиональные бариста</h3>
              <p>Наши специалисты проходят ежегодное обучение</p>
            </div>

            <div className={styles.featureCard}>
              <Award className={styles.featureIcon} />
              <h3>Премиальные зерна</h3>
              <p>Отборные сорта с лучших плантаций мира</p>
            </div>
          </div>
        </section>

        {/* Контактная информация */}
        <section className={styles.contactSection}>
          <div className={styles.contactCard}>
            <h2 className={styles.sectionTitle}>Посетите нас</h2>

            <div className={styles.contactItem}>
              <MapPin className={styles.contactIcon} />
              <div>
                <h3>Адреса</h3>
                {cafes == null
                  ? null
                  : cafes.map((cafe) => <p>{cafe.address}</p>)}
              </div>
            </div>

            <div className={styles.contactItem}>
              <Clock className={styles.contactIcon} />
              <div>
                <h3>Часы работы</h3>
                <p>Пн-Пт: 8:00 - 22:00</p>
                <p>Сб-Вс: 9:00 - 23:00</p>
              </div>
            </div>

            <Link href="/tables_book">
              <button className={styles.reserveButton}>
                Забронировать столик
              </button>
            </Link>
          </div>

          <div className={styles.mapContainer}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j&amp;source=constructor"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Карта расположения кофейни"
            ></iframe>
          </div>
        </section>

        {/* Команда */}
        <section className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Наша команда</h2>

          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <img src="/team-1.jpg" alt="Алексей Петров" />
              <h3>Алексей Петров</h3>
              <p>Главный бариста</p>
            </div>

            <div className={styles.teamMember}>
              <img src="/team-2.jpg" alt="Мария Иванова" />
              <h3>Мария Иванова</h3>
              <p>Шеф-кондитер</p>
            </div>

            <div className={styles.teamMember}>
              <img src="/team-3.jpg" alt="Дмитрий Смирнов" />
              <h3>Дмитрий Смирнов</h3>
              <p>Управляющий</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
