'use client'
import { useEffect, useState } from 'react'
import styles from './MapComponent.module.css'
import Image from 'next/image'

const MapComponent = ({setIsLoading}) => {
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2000 миллисекунд = 2 секунды
      
      // Очищаем таймер при размонтировании компонента
      return () => clearTimeout(timer);
    }
  }, [loading, setIsLoading]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers')
        if (!response.ok) throw new Error('Ошибка загрузки данных')
        const data = await response.json()
        setSuppliers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSuppliers()
  }, [])

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(prev => prev?.id === supplier.id ? null : supplier)
  }

  const handleClosePanel = () => {
    setSelectedSupplier(null)
  }

  const panelPosition = selectedSupplier?.position.x < '50%' ? 'left' : 'right'

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.coffeeLoader}>
        <div className={styles.coffeeCup}></div>
        <p>Загружаем информацию о поставщиках...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>☕</div>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Наши партнеры-поставщики</h1>
          <p className={styles.heroSubtitle}>
            Лучшие кофейные зерна со всей России для вашего идеального вкуса
          </p>
          <div className={styles.heroDivider}></div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.mapContainerWrapper}>
          <div className={`${styles.mapContainer} ${
            selectedSupplier
              ? panelPosition === 'left'
                ? styles.mapShiftedLeft
                : styles.mapShiftedRight
              : ''
          }`}>
            <div className={styles.mapImageWrapper}>
              <Image
                src="/map.png"
                alt="Карта поставщиков кофе"
                fill
                className={styles.mapImage}
                priority
              />

              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className={`${styles.supplierMarker} ${
                    selectedSupplier?.id === supplier.id ? styles.activeMarker : ''
                  }`}
                  style={{
                    left: supplier.position.x,
                    top: supplier.position.y,
                  }}
                  onClick={() => handleSupplierClick(supplier)}
                >
                  <div className={styles.markerPin}></div>
                  <div className={styles.markerCard}>
                    <div className={styles.markerImage}>
                      <Image
                        src="/coffee-beans.jpg"
                        alt="Кофейные зерна"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className={styles.markerName}>
                      {supplier.name.split('\n')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedSupplier && (
            <div className={`${styles.supplierPanel} ${
              panelPosition === 'left' ? styles.panelLeft : styles.panelRight
            }`}>
              <button className={styles.closeButton} onClick={handleClosePanel}>
                &times;
              </button>

              <div className={styles.panelHeader}>
                <h2 className={styles.supplierName}>
                  {selectedSupplier.name.replace('\n', ' ')}
                  <span className={styles.supplierCity}>
                    {selectedSupplier.city}
                  </span>
                </h2>
                <div className={styles.rating}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(selectedSupplier.rating)
                          ? styles.starFilled
                          : styles.starEmpty
                      }
                    >
                      {i < Math.floor(selectedSupplier.rating) ? '★' : '☆'}
                    </span>
                  ))}
                  <span className={styles.ratingValue}>
                    {selectedSupplier.rating}
                  </span>
                </div>
              </div>

              <div className={styles.coffeeImage}>
                <Image
                  src="/coffee-bag.png"
                  alt="Упаковка кофе"
                  width={140}
                  height={140}
                />
              </div>

              <div className={styles.panelContent}>
                <p className={styles.supplierDescription}>
                  {selectedSupplier.description}
                </p>

                <div className={styles.detailsSection}>
                  <h3 className={styles.detailsTitle}>
                    <span className={styles.detailsIcon}>ℹ️</span>
                    Информация о поставках
                  </h3>
                  <ul className={styles.detailsList}>
                    <li>
                      <strong>Основная продукция:</strong>{" "}
                      {selectedSupplier.products.join(', ')}
                    </li>
                    <li>
                      <strong>Срок доставки:</strong>{" "}
                      {selectedSupplier.deliveryTime}
                    </li>
                    <li>
                      <strong>Контакты:</strong> {selectedSupplier.contact}
                    </li>
                  </ul>
                </div>
              </div>

              
            </div>
          )}
        </div>
      </main>

      
    </div>
  )
}

export default MapComponent