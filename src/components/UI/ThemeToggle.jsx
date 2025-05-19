import { useTheme } from "@/lib/ThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id="theme-toggle"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className={styles.checkbox}
      />
      <label htmlFor="theme-toggle" className={styles.toggle}>
        <span className={styles.slider}>
          <span className={`${styles.icon} ${styles.sun}`}>☀️</span>
          <span className={`${styles.icon} ${styles.moon}`}>🌙</span>
        </span>
      </label>
    </div>
  );
}