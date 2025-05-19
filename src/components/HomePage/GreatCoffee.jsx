import React from "react";
import UiInfoBlock from "../UI/UiInfoBlock";
import UiImage from "../UI/UiImage";
import styles from './GreatCoffee.module.css'

export default function GreatCoffee() {
  const title = "Ароматный кофе из лучших зерен";
  const info = (
    <p>
      Кофе поставляется непосредственно с пышных кофейных плантаций Колумбии,
      что гарантирует его высочайшее качество и вкус
    </p>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <UiImage
          source="https://static.insales-cdn.com/files/1/1821/29935389/original/кофе4_1687944416336-1687944422850.jpg"
          name="beans"
        />
      </div>
      <div className={styles.rightSection}>
        <UiInfoBlock title={title} Info={() => info}></UiInfoBlock>
      </div>
    </div>
  );
}
