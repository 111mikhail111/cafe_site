import { useState, useEffect } from "react";
import { PhoneCall, ShoppingCart, UserRound, CalendarDays } from "lucide-react";
import styles from "./Header.module.css";
import UiButton from "../UI/UiButton";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import ThemeToggle from "../UI/ThemeToggle";
import { useAddresses } from "@/lib/AddressContext";

export default function CoffeeShopHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const { 
    addresses, 
    selectedAddress, 
    loading, 
    setSelectedAddress 
  } = useAddresses();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 

  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Логотип и название */}
          <Link href="/" className={styles.logoContainer}>
            <h1 className={styles.title}>404 Coffee</h1>
          </Link>
          <div>Загрузка адресов...</div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Логотип и название */}
        <Link href="/" className={styles.logoContainer}>
          <h1 className={styles.title}>404 Coffee</h1>
        </Link>

        {/* Основная навигация */}
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/menu" className={styles.navLink}>Меню</Link>
            </li>
            <li>
              <Link href="/about" className={styles.navLink}>О нас</Link>
            </li>
            <li>
              <Link href="/drink-constructor" className={styles.navLink}>Конструктор напитка</Link>
            </li>
            <li>
              <Link href="/map" className={styles.navLink}>Поставщики</Link>
            </li>
            <li>
              <Link href="/tables_book" className={styles.navLink}>Забронировать столик</Link>
            </li>
          </ul>
        </nav>

        
        {/* Контакты и действия */}
        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartButton}>
            <UiButton variant="icon">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className={styles.cartBadge}>{cart.length}</span>
              )}
            </UiButton>
          </Link>

          <Link href="/profile" className={styles.profileButton}>
            <UiButton variant="icon">
              <UserRound size={20} />
            </UiButton>
          </Link>

          <ThemeToggle/>
        </div>
      </div>
    </header>
  );
}