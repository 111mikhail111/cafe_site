import { useState, useEffect } from 'react';

export default function useDrinkComponents() {
  const [components, setComponents] = useState({
    bases: [],
    additives: [],
    toppings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('/api/product-composition/drink-components');
        if (!response.ok) {
          throw new Error('Failed to fetch components');
        }
        const data = await response.json();
        setComponents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  return { components, loading, error };
}

/*
const [bases, setBases] = useState([
    { id: 1, name: "Кофе", image: "/drinks/coffee-base.jpg", color: "#6F4E37" },
    {
      id: 2,
      name: "Матча",
      image: "/drinks/matcha-base.jpg",
      color: "#A5D6A7",
    },
    { id: 3, name: "Сок", image: "/drinks/juice-base.jpg", color: "#FF8A65" },
    { id: 4, name: "Молоко", image: "/drinks/milk-base.jpg", color: "#F5F5F5" },
    { id: 5, name: "Какао", image: "/drinks/cocoa-base.jpg", color: "#5D4037" },
  ]);
  const [additives, setAdditives] = useState([
    {
      id: 1,
      name: "Ванильный сироп",
      image: "/drinks/vanilla-add.jpg",
      color: "#FFF9C4",
    },
    {
      id: 2,
      name: "Карамель",
      image: "/drinks/caramel-add.jpg",
      color: "#FFCC80",
    },
    {
      id: 3,
      name: "Шоколад",
      image: "/drinks/chocolate-add.jpg",
      color: "#8D6E63",
    },
    {
      id: 4,
      name: "Кокос",
      image: "/drinks/coconut-add.jpg",
      color: "#F5F5F5",
    },
    { id: 5, name: "Мята", image: "/drinks/mint-add.jpg", color: "#C8E6C9" },
  ]);
  const [toppings, settoppings] = useState([
    {
      id: 1,
      name: "Взбитые сливки",
      image: "/drinks/cream-top.jpg",
      color: "#FFF8E1",
    },
    {
      id: 2,
      name: "Маршмеллоу",
      image: "/drinks/marshmallow-top.jpg",
      color: "#FFFFFF",
    },
    {
      id: 3,
      name: "Крошка печенья",
      image: "/drinks/cookie-top.jpg",
      color: "#D7CCC8",
    },
    {
      id: 4,
      name: "Фрукты",
      image: "/drinks/fruits-top.jpg",
      color: "#FFAB91",
    },
    {
      id: 5,
      name: "Корица",
      image: "/drinks/cinnamon-top.jpg",
      color: "#D7CCC8",
    },
  ])
*/