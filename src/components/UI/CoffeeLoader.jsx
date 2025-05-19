import styles from "./CoffeeLoader.module.css";

export default function CoffeeLoader() {
  return (
    <div className={styles.loader}>
      <div className={styles.container}>
        <div className={styles.coffeeHeader}>
          <div className={styles.coffeeHeaderButtons}></div>
          <div className={styles.coffeeHeaderDisplay}></div>
          <div className={styles.coffeeHeaderDetails}></div>
        </div>
        <div className={styles.coffeeMedium}>
          <div className={styles.coffeeMediumExit}></div>
          <div className={styles.coffeeMediumArm}></div>
          <div className={styles.coffeeMediumLiquid}></div>
          <div className={`${styles.smoke} ${styles.smokeOne}`}></div>
          <div className={`${styles.smoke} ${styles.smokeTwo}`}></div>
          <div className={`${styles.smoke} ${styles.smokeThree}`}></div>
          <div className={`${styles.smoke} ${styles.smokeFour}`}></div>
          <div className={styles.coffeeMediumCup}></div>
        </div>
      </div>
    </div>
  );
}
