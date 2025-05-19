import React from "react";
import { Mail, Phone, Facebook, Instagram, Twitter, MapPin, Clock } from "lucide-react";
import styles from './Footer.module.css';
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Лого и описание */}
          <div className={styles.brandColumn}>
          <h1 className={styles.title}>404 Coffee</h1>
            <p className={styles.description}>
              Наслаждайтесь лучшим кофе в городе с 2010 года. 
              Мы тщательно отбираем зерна и готовим с любовью.
            </p>
          </div>

          {/* Контакты */}
          <div className={styles.contactsColumn}>
            <h3 className={styles.columnTitle}>Контакты</h3>
            <ul className={styles.contactsList}>
              <li className={styles.contactItem}>
                <Phone className={styles.contactIcon} size={18} />
                <span>+7 (123) 456-78-90</span>
              </li>
              <li className={styles.contactItem}>
                <Mail className={styles.contactIcon} size={18} />
                <span>contact@coffeehouse.ru</span>
              </li>
              <li className={styles.contactItem}>
                <MapPin className={styles.contactIcon} size={18} />
                <span>г. Санкт-Петербург, ул. Кофейная, 15</span>
              </li>
              <li className={styles.contactItem}>
                <Clock className={styles.contactIcon} size={18} />
                <span>Ежедневно с 8:00 до 22:00</span>
              </li>
            </ul>
          </div>

          {/* Навигация */}
          <div className={styles.navColumn}>
            <h3 className={styles.columnTitle}>Навигация</h3>
            <nav>
              <ul className={styles.navList}>
                <li><Link href="/menu" className={styles.navLink}>Меню</Link></li>
                <li><Link href="/about" className={styles.navLink}>О нас</Link></li>
                <li><Link href="/map" className={styles.navLink}>Поставщики</Link></li>
                <li><Link href="/drink-constructor" className={styles.navLink}>Создать свой напиток</Link></li>
                <li><Link href="/profile" className={styles.navLink}>Профиль</Link></li>
                <li><Link href="/tables_book" className={styles.navLink}>Забронировать столик</Link></li>
              </ul>
            </nav>
          </div>

          {/* Соцсети и подписка */}
          <div className={styles.socialColumn}>
            <h3 className={styles.columnTitle}>Мы в соцсетях</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter className={styles.socialIcon} />
              </a>
            </div>

            <div className={styles.subscribe}>
              <h4 className={styles.subscribeTitle}>Подписаться на новости</h4>
              <form className={styles.subscribeForm}>
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className={styles.subscribeInput}
                />
                <button type="submit" className={styles.subscribeButton}>
                  Подписаться
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} Coffee House. Все права защищены.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Политика конфиденциальности</Link>
            <Link href="/terms" className={styles.legalLink}>Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}