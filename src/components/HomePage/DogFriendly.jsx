import UiImage from "../UI/UiImage";
import UiInfoBlock from "../UI/UiInfoBlock";
import styles from './DogFriendly.module.css'

export default function DogPolicies() {
  const title = "С собаками можно!";
  const info = (
    <ul> {/* No CSS Module here, UiInfoBlock must handle this */}
      <li>Собака на поводке</li>
      <li>Миска с водой предоставляется</li>
      <li>Уборка за питомцем обязательна</li>
    </ul>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <UiInfoBlock title={title} Info={() => info}></UiInfoBlock>
      </div>
      <div className={styles.rightSection}>
        <UiImage
          source="https://i.pinimg.com/736x/21/fd/78/21fd783ab44f566bd648afac19c4b835.jpg"
          name="dog"
        />
      </div>
    </div>
  );
}
