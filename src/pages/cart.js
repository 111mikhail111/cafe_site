import CartList from "@/components/CartPage/CartList";
import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from "@/components/HomePage/Header";
import { useCart } from "@/lib/CartContext";
import { useEffect } from "react";


export default function Cart() {

    

    return (<div>
        <CoffeeShopHeader/>
        <CartList/>
        <Footer/>
    </div>)
}