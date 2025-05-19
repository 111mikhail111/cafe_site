import { useCart } from "@/lib/CartContext";
import styles from "./ProductCard.module.css";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { cart, addToCart, decreaseQuantity } = useCart();

  return (
    <>
      <div className={styles.carouselCard}>
        <Link href={`/product/${product.id}`}>
          <div className={styles.imageContainer}>
            <img
              src={product.image_url}
              alt={product.name}
              className={styles.carouselImage}
              loading="lazy"
            />
            <div className={styles.priceTag}>{product.price}p</div>
          </div>
        </Link>

        <div className={styles.carouselCardContent}>
          <Link href={`/product/${product.id}`}>
            {" "}
            <h3 className={styles.carouselCardTitle}>{product.name}</h3>
          </Link>

          <p className={styles.carouselCardDescription}>
            {product.description}
          </p>
          <AddToCartButton
            cart={cart}
            product={product}
            addToCart={addToCart}
            decreaseQuantity={decreaseQuantity}
          />
        </div>
      </div>
    </>
  );
}

export const AddToCartButton = ({ cart, product, addToCart, decreaseQuantity }) => {
  if (cart.some((item) => item.id === product.id))
    return (
      <>
        <div className={styles.orderButton}>
          <div className={styles.btnContainer}>
            <button
              className={styles.quantityBtn}
              onClick={() => decreaseQuantity(product.id)}
            >
              -
            </button>
            <div>{cart.find((item) => item.id === product.id).quantity}</div>
            <button
              className={styles.quantityBtn}
              onClick={() => addToCart(product)}
            >
              +
            </button>
          </div>
        </div>
      </>
    );
  else
    return (
      <button className={styles.orderButton} onClick={() => addToCart(product)}>
        В корзину
      </button>
    );
};
