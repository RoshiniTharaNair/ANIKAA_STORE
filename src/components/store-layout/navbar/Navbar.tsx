import { FC, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccountDropdown from '@/components/layout/dropdowns/account-dropdown';
import CartDropdown from '@/components/layout/dropdowns/cart-dropdown';
import WishlistDropdown from '@/components/layout/dropdowns/wishlist-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SearchComponent from '@/components/layout/search-component/SearchComponent';
import SubCategories from '../subcategory/SubCategories';
import MeasurementTapeSale from '@/components/layout/measurement-tape-sale/MeasurementTapeSale';
import { useProductCategories } from 'medusa-react';
import axios from 'axios'; // Import axios for API calls
import './NavBar.css';

type Timeout = ReturnType<typeof setTimeout>;

const NavBar: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [categoryImage, setCategoryImage] = useState<string>(''); // State for storing the fetched category image
  const [isMobile, setIsMobile] = useState(false);
  const { product_categories } = useProductCategories(); // Fetch product categories
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null); // Track which top-level category is expanded

  const topLevelCategories = product_categories?.filter(
    (category) => category.parent_category_id === null
  ) || [];

  const categoryTimeoutRef = useRef<Timeout | null>(null);
  const subCategoryTimeoutRef = useRef<Timeout | null>(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  // Fetch the category image using Axios when hovering over a category
  const handleCategoryMouseEnter = async (category: any) => {
    // Clear previous timeouts
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    if (subCategoryTimeoutRef.current) {
      clearTimeout(subCategoryTimeoutRef.current);
    }

    try {
      // Use axios to make the API call
      const response = await axios.get(`http://localhost:9000/store/categoryImage`, {
        params: { category_id: category.id },
      });
      const data = response.data;

      // Check if `navimage` exists before setting the category
      const fetchedImage = data.data[0]?.navimage || '';
      if (fetchedImage) {
        // Update the state with the fetched image and selected category
        setCategoryImage(fetchedImage);
        setSelectedCategory(category);
      } else {
        // If no `navimage` is available, reset the state
        setCategoryImage('');
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error fetching category image:', error);
      // Reset states in case of error
      setCategoryImage('');
      setSelectedCategory(null);
    }
  };

  const handleCategoryMouseLeave = () => {
    // Set a timeout to clear the selected category and image after a short delay
    categoryTimeoutRef.current = setTimeout(() => {
      setSelectedCategory(null); // Reset selected category on mouse leave
      setCategoryImage(''); // Clear category image
    }, 300);
  };

  const handleSubCategoryMouseEnter = () => {
    // Clear both category and subcategory timeouts when hovering over subcategories
    if (subCategoryTimeoutRef.current) {
      clearTimeout(subCategoryTimeoutRef.current);
    }
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
  };

  const handleSubCategoryMouseLeave = () => {
    // Set a timeout to clear the selected subcategory after a short delay
    subCategoryTimeoutRef.current = setTimeout(() => {
      setSelectedCategory(null); // Reset selected category when leaving subcategories
      setCategoryImage(''); // Clear category image
    }, 300);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
  
    // Adjust the top of .subcategory-wrapper based on .storenav-wrapper height
    const storenavWrapper = document.querySelector('.storenav-wrapper') as HTMLElement | null;
    const subcategoryWrapper = document.querySelector('.subcategory-wrapper') as HTMLElement | null;
  
    if (subcategoryWrapper && storenavWrapper) {
      const storenavHeight = storenavWrapper.offsetHeight; // Now TypeScript knows that it's an HTMLElement
      subcategoryWrapper.style.top = `${storenavHeight}px`; // Set the top based on storenav height
    }
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      // If the same category is clicked again, collapse it
      setExpandedCategoryId(null);
    } else {
      // Expand the clicked category
      setExpandedCategoryId(categoryId);
    }
  };

  return (
    <>
      <div className="storenav-wrapper">
        <div className="storenav">
          <div className="storenav-left">
            {isMobile && (
              <button onClick={handleMenuToggle} className="menu-button">
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
            <Link href="/">
              <Image
                src="/logo25.png"
                alt="Anikaa Logo"
                width={isMobile ? 100 : 150} // Adjust size for mobile
                height={isMobile ? 30 : 50} // Adjust size for mobile
              />
            </Link>
          </div>
          {!isMobile && (
            <div className="storenav-center">
              {/* Render categories dynamically from product_categories */}
              {topLevelCategories?.map((category) => (
                <div
                  key={category.id}
                  className="category-link-wrapper"
                  onMouseEnter={() => handleCategoryMouseEnter(category)} // Pass the hovered category to state
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <Link href={`/${category.handle}`} className="category-link font-lato-bold">
                    {category.name}
                  </Link>
                </div>
              ))}
              <MeasurementTapeSale />
            </div>
          )}
          <div className="storenav-right">
            {isMobile && (
              <>
                <button onClick={handleSearchToggle} className="storenav-icon-button">
                  <FontAwesomeIcon icon={faSearch} className="storenav-icon" />
                </button>
                <CartDropdown />
              </>
            )}
            {!isMobile && (
              <>
                <button onClick={handleSearchToggle} className="storenav-icon-button">
                  <FontAwesomeIcon icon={faSearch} className="storenav-icon" />
                </button>
                <div>
                  <AccountDropdown />
                </div>
                <WishlistDropdown />
                <CartDropdown />
              </>
            )}
          </div>
          {menuOpen && isMobile && (
            <div className="mobile-menu">
              <button className="close-button" onClick={handleMenuToggle}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <AccountDropdown />
              <WishlistDropdown />

              <div className="storecategories">
  {topLevelCategories.map((category) => (
    <div key={category.id} style={{ marginBottom: "0.3rem" }}>
      {/* Top-level category link */}
      <div style={{ display: "flex"}}>
  {/* Top-level category link */}
  <Link
    href={`/explore/${category.handle}`}
   
    className="text-lg font-bold cursor-pointer transition duration-300 ease-in-out"
    style={{
      // display: "inline-flex",
      background: "white",
      color: expandedCategoryId === category.id ? "#56242e" : "#000", // Apply color conditionally
      textDecoration: expandedCategoryId === category.id ? "underline" : "none", // Apply underline conditionally
      // alignItems: "center",
      gap: "0", // Ensure no gap is introduced between text and icon
      padding: "0", // Remove padding
      margin: "0", // Remove margin
    }}
  >
   <span  onClick={(e) => {
      e.preventDefault(); // Prevent navigation on click
      handleCategoryClick(category.id);
    }}>{category.name}</span> 

    {/* Right arrow button to navigate to category page */}
    {expandedCategoryId === category.id && (
      <a href={`/explore/${category.handle}`}><FontAwesomeIcon
        icon={faArrowRight}
        style={{
          color: "#56242e", // Set color to match the expanded state
          padding: "0", // Remove any extra padding
          margin: "0", // Remove any extra margin
          paddingLeft:"5%"
        }}
      />
      </a>
    )}
  </Link>
</div>



      {/* Conditionally render the subcategories if this category is expanded */}
      {expandedCategoryId === category.id && (
        <div
          className="subcategory-list"
          style={{ paddingLeft: "", marginTop: "0.5rem"}}
        >
          {category.category_children?.length > 0 ? (
            category.category_children.map((subCategory: any) => (
              <Link
                key={subCategory.id}
                href={`/explore/${subCategory.handle}`}
                onClick={handleMenuToggle}
                className="block text-base text-white hover:text-gray-300 mt-1 transition duration-300 ease-in-out"
                style={{textAlign:"left", display:"flex",alignItems:"flex-start",}}
              >
                {subCategory.name}
              </Link>
            ))
          ) : (
            <p className="text-black text-sm mt-1">
              No subcategories available
            </p>
          )}
        </div>
      )}
    </div>
  ))}
</div>

              <MeasurementTapeSale className="measurement-tape-sale" />
            </div>
          )}
          {searchOpen && <SearchComponent onClose={handleSearchToggle} />}
        </div>
      </div>

      {/* Only display SubCategories if both selectedCategory and categoryImage are available */}
      {selectedCategory && categoryImage && (
        <SubCategories
          subcategories={selectedCategory.category_children || []} // Pass subcategories of the selected category
          parentCategoryImage={categoryImage} // Use the fetched category image
          parentCategoryName={selectedCategory.name} // Pass the parent category name
          onMouseEnter={handleSubCategoryMouseEnter}
          onMouseLeave={handleSubCategoryMouseLeave}
        />
      )}
    </>
  );
};

export default NavBar;
