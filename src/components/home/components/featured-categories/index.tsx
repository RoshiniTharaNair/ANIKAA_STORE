import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import styles from "./featuredCategories.module.css";

const categories = [
  { name: "Blouse", image: "/blouse30.jpg" },
  { name: "Gown", image: "/gown30.jpg" },
  { name: "Kurta", image: "/kurta30.jpg" },
  { name: "Lehenga", image: "/lehenga30.jpg" },
];

const FeaturedCategories: React.FC = () => {
  const [visibleCategories, setVisibleCategories] = useState<number[]>([]);
  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    categories.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleCategories((prev) => [...prev, index]);
      }, index * 500);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Function to handle button click
  const handleExploreClick = () => {
    router.push("/clothing/store"); // Navigate to /clothing/store
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Explore Our Elegant Categories</h2>
      <div className={styles.categories}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`${styles.category} ${visibleCategories.includes(index) ? styles.visible : ''}`}
          >
            <img src={category.image} alt={category.name} className={styles.image} />
            <button className={styles.categoryName} style={{fontWeight:"bolder"}}>Customize {category.name}</button>
          </div>
        ))}
      </div>
      {/* Button to explore all outfits */}
      <button className={styles.exploreButton} onClick={handleExploreClick}>
        Explore All Categories
      </button>
    </div>
  );
};

export default FeaturedCategories;
