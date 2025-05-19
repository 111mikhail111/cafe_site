import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import "@/styles/HomePage/Header.css";
import "@/styles/ui-elements.css";

import { CartProvider } from "@/lib/CartContext";
import { ClientProvider } from "@/lib/ClientContext";
import { AddressesProvider } from "@/lib/AddressContext";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <ClientProvider>
          <AddressesProvider>
            <Component {...pageProps} />
          </AddressesProvider>
        </ClientProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
