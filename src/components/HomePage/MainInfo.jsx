import React from 'react'
import { Home, Mail, Phone } from "lucide-react"
import styles from './MainInfo.module.css'

export default function MainInfo() {
  return (
    <div className={styles.coffeeShopHomePage}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.content}>
        <div className="max-w-3xl space-y-4"> {/* Tailwind classes remain */}
          <h1 className={styles.welcomeMessage}>Welcome to Our Coffee Shop</h1>
          <div className={styles.description}>
            Savor the aroma of freshly brewed coffee in our cozy and inviting atmosphere. Whether you're looking for a quick caffeine fix or a place to relax and work, we've got you covered.
          </div>
          <div className={`flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6 ${styles.contactDetails}`}>
            <div className="flex items-center space-x-2">
              <Home className={styles.icon} />
              <p>123 Coffee Lane, Brew City, CA 90210</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className={styles.icon} />
              <p>(123) 456-7890</p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className={styles.icon} />
              <p>contact@coffeeshop.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}