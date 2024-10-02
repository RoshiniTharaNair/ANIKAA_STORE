import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "../styles/ProductItem.module.css";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

interface Subcategory {
  id: number;
  title: string;
  image: string;
  price?: number;
  deliveryTime?: number;
}

interface ProductItemProps {
  product: PricedProduct & {
    subcategories?: Subcategory[]; // Optional property to handle subcategories
  };
  onProductClick: (subcategories: Subcategory[]) => void;
}

const ProductItem: FC<ProductItemProps> = ({ product, onProductClick }) => {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
  const [avgPrice, setAvgPrice] = useState<number | null>(null);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState<number | null>(null);

  // Extract price and currency from the product variants
  const variant = product.variants ? product.variants[0] : null;
  const price = variant?.prices?.[0]?.amount || 0; // Fallback to 0 if price is unavailable
  const currency = variant?.prices?.[0]?.currency_code || "USD"; // Default currency as USD

  // Determine currency symbol based on currency code
  const currencySymbol = currency === "inr" ? "₹" : "$";

  // Fetch additional product details from the API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/store/products/${product.id}`);
        const productData = response.data.product;
        setAvgPrice(productData.avg_price);
        setAvgDeliveryTime(productData.avg_delivery_time);
        // console.log("API Response: ", productData); // Log API response
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (product.id) {
      fetchProductDetails(); // Call the function when the component mounts
    }
  }, [product.id]);

  const handleProductClick = () => {
    if (product.subcategories && product.subcategories.length > 0) {
      onProductClick(product.subcategories);
    } else {
      // Navigate to the product customization page
      const slug = product.title.replace(/\s+/g, '').toLowerCase();
      router.push(`/explore/products/${slug}`);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
  };

  const handleMouseEnter = (subcategory: Subcategory | null, event: React.MouseEvent) => {
    const content = subcategory
      ? `${subcategory.title}${subcategory.price ? ` - $${subcategory.price}` : ''}${subcategory.deliveryTime ? `, Delivery: ${subcategory.deliveryTime} days` : ''}`
      : `${product.title}${product.price ? ` - $${product.price}` : ''}${product.deliveryTime ? `, Delivery: ${product.deliveryTime} days` : ''}`;

    setTooltipContent(content);
    setTooltipPosition({ left: event.clientX + 10, top: event.clientY + 10 });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
    setTooltipPosition(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltipContent) {
      setTooltipPosition({ left: event.clientX + 10, top: event.clientY + 10 });
    }
  };

  // Displayed image, title, and price based on the selected subcategory or the main product
  const displayedImage = selectedSubcategory ? selectedSubcategory.image : product.thumbnail || "";
  const displayedTitle = selectedSubcategory ? selectedSubcategory.title : product.title;
  const displayedPrice = selectedSubcategory ? selectedSubcategory.price : price;

  // Helper function to display a range of numbers for avg_price and avg_delivery_time
  const getRange = (value: number) => {
    const roundedValue = Math.floor(value);
    return `${roundedValue} - ${roundedValue + 1}`;
  };

  return (
    <div className={styles.productItem} onClick={handleProductClick} onMouseMove={handleMouseMove}>
      <img
        src={displayedImage}
        alt={displayedTitle}
        className={`${styles.productImage} ${selectedSubcategory === null && styles.activeImage}`}
      />
      <div className={styles.productDetails}>
        {product.is_giftcard && <div className={styles.trendingLabel}>Giftcard</div>}
        <div className={styles.productTitle}>{displayedTitle}</div>
        {avgPrice !== null && (
          <div className={styles.productPrice}>
            {currencySymbol} {getRange(avgPrice)} {/* Divide by 100 for proper price formatting */}
          </div>
        )}
        {/* Display avg_price and avg_delivery_time as a range */}
        {/* {avgPrice !== null && (
          <div className={styles.productAvgPrice}>
            Average Price: {currencySymbol} {getRange(avgPrice)}
          </div>
        )} */}
        {avgDeliveryTime !== null && (
          <div className={styles.productPrice}>
            Delivery in {getRange(avgDeliveryTime)} days
          </div>
        )}
        <div className={styles.subcategoryContainer} onClick={(e) => e.stopPropagation()}>
          {product.subcategories && product.subcategories.map((subcategory) => (
            <img
              key={subcategory.id}
              src={subcategory.image}
              alt={subcategory.title}
              className={`${styles.subcategoryImage} ${selectedSubcategory?.id === subcategory.id && styles.activeImage}`}
              onClick={() => handleSubcategoryClick(subcategory)}
              onMouseEnter={(e) => handleMouseEnter(subcategory, e)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
        {tooltipContent && tooltipPosition && (
          <div
            className={styles.tooltip}
            style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
