import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter from next/router
import styles from "./accessoriesCarousel.module.css";

const accessoriesImages = [
  { src: "/acessories9.jpg", alt: "Sparkling Crystal Bead Trim", price: "₹560", originalPrice: "₹1400", discount: "60% OFF" },
  { src: "/access1.jpg", alt: "Golden Vintage Buttons and Turquoise Threads", price: "₹1000", originalPrice: "₹2500", discount: "₹1500 OFF" },
  { src: "/access2.jpg", alt: "Exquisite Traditional Pendant with Colorful Gems", price: "₹960", originalPrice: "₹2400", discount: "Buy 1 Get 2 Free" },
  { src: "/access3.jpg", alt: "Silk Fabric Rolls with Ornamental Patterns", price: "₹880", originalPrice: "₹2200", discount: "No Discount" },
  { src: "/access4.jpg", alt: "Assorted Colorful Beads for Crafting", price: "₹720", originalPrice: "₹1800", discount: "" },
  { src: "/access5.jpg", alt: "Antique Brass Buttons with Intricate Design", price: "₹560", originalPrice: "₹1400", discount: "60% OFF" },
  { src: "/access6.jpg", alt: "Vintage Buttons and Turquoise Threads Set", price: "₹1000", originalPrice: "₹2500", discount: "₹1500 OFF" },
  { src: "/access7.jpg", alt: "Collection of Assorted Colorful Buttons", price: "₹960", originalPrice: "₹2400", discount: "Buy 1 Get 2 Free" },
  { src: "/access8.jpg", alt: "Beautifully Wrapped Gift with Ornamental Fabric", price: "₹880", originalPrice: "₹2200", discount: "No Discount" },
  { src: "/access9.jpg", alt: "Intricately Designed Antique Button and Thread Set", price: "₹720", originalPrice: "₹1800", discount: "" },
  { src: "/access10.jpg", alt: "Elegant Craft Buttons and Accessories Kit", price: "₹560", originalPrice: "₹1400", discount: "60% OFF" },
  { src: "/access11.jpg", alt: "Ornate Golden Brooch with Red Accents", price: "₹1000", originalPrice: "₹2500", discount: "₹1500 OFF" },
  { src: "/access12.jpg", alt: "Elegant Pearl and Bead Bracelet Kit", price: "₹960", originalPrice: "₹2400", discount: "Buy 1 Get 2 Free" },
  { src: "/access13.jpg", alt: "Multicolor Bead and Thread Organizer", price: "₹880", originalPrice: "₹2200", discount: "No Discount" },
  { src: "/access14.jpg", alt: "Bronze Bead and Pendant Craft Kit", price: "₹720", originalPrice: "₹1800", discount: "" },
  { src: "/access15.jpg", alt: "Rustic Burlap and Twine Decoration Set", price: "₹560", originalPrice: "₹1400", discount: "60% OFF" },
  { src: "/access16.jpg", alt: "Golden Beaded Necklace and Craft Supplies", price: "₹1000", originalPrice: "₹2500", discount: "₹1500 OFF" },
  { src: "/access17.jpg", alt: "Intricate White Lace Fabric", price: "₹960", originalPrice: "₹2400", discount: "Buy 1 Get 2 Free" },
  { src: "/access18.jpg", alt: "Shimmery Metallic Thread Spools", price: "₹880", originalPrice: "₹2200", discount: "No Discount" },
  { src: "/access19.jpg", alt: "Colorful Embroidered Brooch", price: "₹720", originalPrice: "₹1800", discount: "" },
  { src: "/access20.jpg", alt: "Peach Zipper with Green Fabric Accent", price: "₹720", originalPrice: "₹1800", discount: "" }
];

const ITEMS_PER_PAGE = 5;

const AccessoriesCarousel: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      if (cardRefs.current) {
        cardRefs.current.forEach((ref) => {
          if (ref) {
            observer.unobserve(ref);
          }
        });
      }
    };
  }, []);

  const getCurrentItems = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = accessoriesImages.slice(startIndex, endIndex);

    if (items.length < ITEMS_PER_PAGE) {
      return [...items, ...accessoriesImages.slice(0, ITEMS_PER_PAGE - items.length)];
    }

    return items;
  };

  const currentItems = getCurrentItems();

  const navigateToAccessories = () => {
    router.push("/accessories"); // Navigate to /accessories page
  };

  return (
    <div className={styles.container}>
      <h3 className={`${styles.categoryName} font-caviar-bold`}>Choose Your Perfect Accessories</h3>
      <p className={styles.description}>
        Explore our curated collection of accessories that can be custom-stitched to your material. Select your desired accessories and we will tailor them perfectly for you.
      </p>
      <div className={styles.grid}>
        {currentItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.card} font-caviar-bold ${styles.hidden}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
              {item.discount && item.discount !== "No Discount" && (
                <div className={styles.discount}>{item.discount}</div>
              )}
            </div>
            <div className={styles.details}>
              <h4 className={styles.title}>{item.alt}</h4>
              <div className={styles.price}>
                {item.discount && item.discount !== "No Discount" ? (
                  <>
                    <span className={styles.currentPrice}>{item.price}</span>
                    <span className={styles.originalPrice}>{item.originalPrice}</span>
                  </>
                ) : (
                  <span className={styles.currentPrice}>{item.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          className={`${styles.showAllButton} font-caviar`}
          onClick={navigateToAccessories} // Add onClick event to navigate
        >
          <span className={styles.arrow}></span>
        </button>
      </div>
    </div>
  );
};

export default AccessoriesCarousel;
