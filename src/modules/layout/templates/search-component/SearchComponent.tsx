"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchComponent.module.css";

const products = [
  { id: 1, title: "Blouse", price: "$20", image: "/blouse30.jpg" },
  { id: 2, title: "Gown", price: "$50", image: "/gown30.jpg" },
  { id: 3, title: "Tops", price: "$15", image: "/tops30.jpg" },
  { id: 4, title: "Skirts", price: "$25", image: "/skirts30.jpg" },
  { id: 5, title: "Chudidhar Sets", price: "$30", image: "/chudidhar30.jpg" },
  { id: 6, title: "Lehenga", price: "$70", image: "/lehenga30.jpg" },
  { id: 7, title: "Dress", price: "$60", image: "/dress30.jpg" },
  { id: 8, title: "Saree", price: "$80", image: "/saree30.jpg" },
  { id: 9, title: "Shirt", price: "$40", image: "/shirt30.jpg" },
];

interface SearchComponentProps {
  onClose: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add(styles.noScroll);
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>
      <div className={styles.searchResults}>
        {filteredProducts.slice(0, 9).map((product) => (
          <div
            key={product.id}
            className={styles.productItem}
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <img src={product.image} alt={product.title} className={styles.productImage} />
            <div className={styles.productTitle}>{product.title}</div>
            <div className={styles.productPrice}>{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
