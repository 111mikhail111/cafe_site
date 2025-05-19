import React from 'react'
import UiInfoBlock from '../UI/UiInfoBlock';
import UiImage from '../UI/UiImage';
import styles from './DogFriendly.module.css'


export default function Deserts() {
  const title = "Десерты, которые поразят";
  const info = (
    <p>Сочетание, которое покорит твое сердце: кофе и домашний десерт</p>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <UiImage
          source="https://www.brides.com/thmb/QyPKgi1MoQQHz0GNGTWA49Nhzus=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1207948426-7c097d2ab12749d3afab359a2536840d.jpg"
          name="cheesecake"
        />
      </div>
      <div className={styles.rightSection}>
        <UiInfoBlock title={title} Info={() => info}></UiInfoBlock>
      </div>
    </div>
  );
}
