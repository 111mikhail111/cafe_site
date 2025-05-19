import { useState, useEffect } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import styles from "./Categories.module.css";
import UiLoader from "../UI/UiLoader";

export default function Categories({ onSelectKind, setIsLoading }) {
  const [selectedMenuType, setSelectedMenuType] = useState(null);
  const [types, setTypes] = useState([]);
  const [kinds, setKinds] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingKinds, setIsLoadingKinds] = useState(false);
  const [hoveredType, setHoveredType] = useState(null);

  

  useEffect(() => {
    fetch("/api/gettypes")
      .then((response) => response.json())
      .then((data) => {
        setTypes(data);
        setSelectedMenuType(data[0]);
        loadKinds(data[0]);
      });
    setIsLoadingTypes(false);
  }, []);

  const loadKinds = (menuType) => {
    const menuTypeId = menuType.id;
    setSelectedMenuType(menuType);
    setIsLoadingKinds(true);
    fetch(`/api/getkinds?typeId=${menuTypeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке видов меню");
        }
        return response.json();
      })
      .then((data) => {
        setKinds(data);
        onSelectKind(data[0]);
        setIsLoadingKinds(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке видов меню:", error);
        setIsLoadingKinds(false);
      });
  };

  return (
    <div className={styles.menuCard}>
      <div className={styles.menuHeader}>
        <h2 className={styles.menuTitle}>Категории</h2>
        <div className={styles.titleUnderline}></div>
      </div>
      <div className={styles.menuContent}>
        <div className={styles.menuTypes}>
          {isLoadingTypes ? (
            <div>Загрузка типов...</div>
          ) : (
            types.map((menuType) => (
              <button
                key={menuType.id}
                className={`${styles.menuTypeButton} ${
                  selectedMenuType?.id === menuType.id ? styles.activeType : ""
                }`}
                onClick={() => loadKinds(menuType)}
                onMouseEnter={() => setHoveredType(menuType.id)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <span className={styles.menuTypeText}>{menuType.name}</span>
                <div className={styles.iconWrapper}>
                  <ChevronRight className={styles.menuTypeIcon} />
                </div>
                <span className={styles.hoverEffect}></span>
              </button>
            ))
          )}
        </div>
        {selectedMenuType && (
          <div className={styles.menuKinds}>
            <h3 className={styles.menuKindsTitle}>
              {selectedMenuType.name}
              <span className={styles.titleDecorator}></span>
            </h3>
            <div className={styles.menuKindsList}>
              {isLoadingKinds ? (
                <div>Загрузка видов...</div>
              ) : (
                kinds.map((kind) => (
                  <div
                    key={kind.Id}
                    className={styles.menuKindItem}
                    onClick={() => onSelectKind(kind)}
                  >
                    {kind.name}
                    <span className={styles.kindHoverEffect}></span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
