import React from "react";
import UiInfoBlock from "../UI/UiInfoBlock";
import UiImage from "../UI/UiImage";
import styles from './DogFriendly.module.css'

export default function Lunch() {
  const title = "Вкусный обед каждый день";
  const info = (
    <p>Для быстрого перекуса, приятного приема пищи и неожиданных открытий</p>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <UiInfoBlock title={title} Info={() => info}></UiInfoBlock>
      </div>
      <div className={styles.rightSection}>
        <UiImage
          source="https://eda.ru/images/RecipeOpenGraph/1200x630/borsch-po-klassicheskomu-receptu_114490_ogimage.jpg"
          name="borstch"
        />
      </div>
    </div>
  );
}
