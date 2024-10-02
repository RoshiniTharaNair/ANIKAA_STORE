"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import axios from "axios"; 
import FilterComponent from "../components/FilterComponent";
import SortComponent from "../components/SortComponent";
import ProductItem from "../components/ProductItem"; 
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"; 
import { ProductCategory } from "@medusajs/medusa"; 
import { useProductCategories } from "medusa-react";
import styles from "../styles/store.module.css";

const CategoryPage = () => {
  const pathname = usePathname();
  const categoryHandle = pathname.split("/")[2]; 
  const router = useRouter();

  const [filteredProducts, setFilteredProducts] = useState<PricedProduct[]>([]);
  const [productsToShow, setProductsToShow] = useState<PricedProduct[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["All Outfits"]);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [isSortApplied, setIsSortApplied] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { product_categories, isLoading: categoriesLoading } = useProductCategories();
  const selectedCategory: ProductCategory | undefined = product_categories?.find((cat) => cat.handle === categoryHandle);

  // Track whether filters have been applied manually by the user
  const [filterManuallyChanged, setFilterManuallyChanged] = useState<boolean>(false);

  const fetchCategoryProducts = async (categoryId: string) => {
    try {
      setIsLoading(true); // Start loading
      const response = await axios.get(`http://localhost:9000/store/categoryProducts`, {
        params: {
          category_id: categoryId, 
        },
      });

      const products: PricedProduct[] = response.data.products;
      setFilteredProducts(products);
      setProductsToShow(products);
      setIsLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory.id); 
      updateBreadcrumb(selectedCategory.name);
    }
  }, [selectedCategory]);

  const updateBreadcrumb = (categoryTitle: string) => {
    setBreadcrumb((prev) => {
      if (prev[prev.length - 1] !== categoryTitle) {
        return [...prev, categoryTitle];
      }
      return prev;
    });
  };

  // Apply the filters only if the user has manually changed the filters
  const handleFilter = (filters: any) => {
    if (filterManuallyChanged) {
      let filtered = filteredProducts;

      if (filters.discount) {
        filtered = filtered.filter((product) => product.discountable === filters.discount);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filtered = filtered.filter((product) => {
          const price = product.variants?.[0]?.prices?.[0]?.amount || 0;
          return price >= min && price <= max;
        });
      }

      setProductsToShow(filtered);
      setIsFilterApplied(filters.discount || filters.priceRange);
    }
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
    const sortedProducts = applySort([...filteredProducts], sortOption);
    setProductsToShow(sortedProducts);
    setIsSortApplied(sortOption !== "");
  };

  const applySort = (products: PricedProduct[], sortOption: string) => {
    const getPrice = (product: PricedProduct) => {
      const firstVariant = product.variants?.[0];
      const price = firstVariant?.prices?.[0]?.amount || 0; 
      return price;
    };

    const getDeliveryTime = (product: PricedProduct): number => {
      return Number((product.metadata?.delivery_time as number) || 0);
    };

    if (sortOption === "price-asc") {
      return products.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortOption === "price-desc") {
      return products.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sortOption === "delivery-time-asc") {
      return products.sort((a, b) => getDeliveryTime(a) - getDeliveryTime(b));
    } else if (sortOption === "delivery-time-desc") {
      return products.sort((a, b) => getDeliveryTime(b) - getDeliveryTime(a));
    }
    return products;
  };

  const handleFilterApplied = (status: boolean) => {
    setIsFilterApplied(status);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setBreadcrumb(["All Outfits"]);
      // router.push("/clothing/store");
    } else {
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);
      // router.push(`/clothing/store/${newBreadcrumb[index].toLowerCase()}`);
    }
  };

  const handleProductClick = (subcategories: any) => {
    // console.log("Subcategories clicked:", subcategories);
  };

  if (isLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.storeContainer}>
      <div className={styles.breadcrumb}>
        {breadcrumb.map((crumb, index) => (
          <span key={index}>
            <span
              className={`${styles.breadcrumbLink} ${index === breadcrumb.length - 1 && styles.currentCategory}`}
              onClick={() => handleBreadcrumbClick(index)}
            >
              {crumb}
            </span>
            {index < breadcrumb.length - 1 && <span className={styles.separator}> &gt; </span>}
          </span>
        ))}
      </div>

      <hr className={styles.breadcrumbLine} />

      {/* <div className={styles.filterSortContainer}>
        <FilterComponent
          onFilter={handleFilter}
          isFilterApplied={handleFilterApplied}
          onClearFilters={() => {}}
          clearTrigger={false}
          onManualChange={() => setFilterManuallyChanged(true)} // New prop to detect manual changes
        />
        <SortComponent onSort={handleSort} isSortApplied={setIsSortApplied} clearTrigger={false} />
      </div> */}

      <div className={styles.productGrid}>
        {productsToShow.map((product) => (
          <ProductItem key={product.id} product={product} onProductClick={handleProductClick} />
        ))}
      </div>
      {productsToShow.length === 0 && <div>No products found for {selectedCategory?.name}</div>}
    </div>
  );
};

export default CategoryPage;
