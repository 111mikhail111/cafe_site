'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BannerCarousel.module.css';

const banners = [
  {
    id: 1,
    title: "Создай свой уникальный напиток",
    description: "Конструктор напитков с эксклюзивными ингредиентами",
    link: "/drink-constructor",
    linkText: "Создать напиток",
    image: "/images/banner-constructor.jpg",
    bgColor: "var(--dark)"
  },
  {
    id: 2,
    title: "Откройте мир премиального кофе",
    description: "Наши эксклюзивные сорта от лучших поставщиков",
    link: "/map",
    linkText: "Узнать о поставщиках",
    image: "/images/banner-suppliers.jpg",
    bgColor: "var(--dark)"
  },
  {
    id: 3,
    title: "Забронируйте столик онлайн",
    description: "Гарантируем уютную атмосферу в выбранное время",
    link: "/tables_book",
    linkText: "Забронировать",
    image: "/images/banner-booking.jpg",
    bgColor: "var(--dark)"
  },
  {
    id: 4,
    title: "Наше сезонное меню",
    description: "Попробуйте новые вкусы этого сезона",
    link: "/menu",
    linkText: "Посмотреть меню",
    image: "/images/banner-menu.jpg",
    bgColor: "var(--dark)"
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlay]);

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div 
        className={styles.carouselInner}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className={styles.banner}
            style={{ backgroundColor: banner.bgColor }}
          >
            <div className={styles.bannerContent}>
              <div className={styles.textContent}>
                <h2 className={styles.title}>{banner.title}</h2>
                <p className={styles.description}>{banner.description}</p>
                <Link 
                  href={banner.link} 
                  className={styles.ctaButton}
                >
                  {banner.linkText}
                  <ArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
              <div className={styles.imageContainer}>
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className={styles.bannerImage}
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={prevSlide} 
        className={`${styles.controlButton} ${styles.prevButton}`}
        aria-label="Previous banner"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide} 
        className={`${styles.controlButton} ${styles.nextButton}`}
        aria-label="Next banner"
      >
        <ChevronRight size={32} />
      </button>

      <div className={styles.dotsContainer}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}