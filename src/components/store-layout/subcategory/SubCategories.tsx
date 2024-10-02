import Link from 'next/link';
import { FC, useState } from 'react';
import Image from 'next/image';
import axios from 'axios'; // Import axios for API calls
import './SubCategories.css';

interface SubCategory {
  name: string;
  link?: string; // Marking link as optional
  image: string; // Default image provided for the subcategory
  id: string; // Subcategory ID for API requests
}

interface SubCategoriesProps {
  subcategories: SubCategory[];
  parentCategoryImage: string;
  parentCategoryName: string; // Added parent category name
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SubCategories: FC<SubCategoriesProps> = ({ subcategories, parentCategoryImage, parentCategoryName, onMouseEnter, onMouseLeave }) => {
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);

  // Fetch subcategory image using the API
  const fetchCategoryImage = async (categoryId: string) => {
    try {
      const response = await axios.get(`http://localhost:9000/store/categoryImage`, {
        params: { category_id: categoryId },
      });
      const data = response.data;
      if (data?.data?.length > 0) {
        return data.data[0].navimage; // Return navimage if available
      }
    } catch (error) {
      console.error('Error fetching subcategory image:', error);
      return null; // Return null if there's an error
    }
  };

  // Handle mouse hover for subcategories
  const handleMouseEnter = async (subcategory: SubCategory) => {
    // Set the subcategory image immediately to avoid delays
    setHoveredSubCategory(subcategory.image);

    // Fetch the category image asynchronously
    const imageUrl = await fetchCategoryImage(subcategory.id);
    if (imageUrl) {
      setHoveredSubCategory(imageUrl); // Update to fetched image if available
    }
  };

  const handleMouseLeave = () => {
    setHoveredSubCategory(null); // Reset to parent category image on mouse leave
  };

  return (
    <div className="subcategory-wrapper" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="subcategory-names">
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <div // Wrapper div to handle hover event
              key={subcategory.id}
              className="subcategory-link"
              onMouseEnter={() => handleMouseEnter(subcategory)} // Fetch image on hover
              onMouseLeave={handleMouseLeave} // Reset image on leave
            >
              {subcategory.link ? (
                <Link href={subcategory.link}>
                  {subcategory.name}
                </Link>
              ) : (
                <span>{subcategory.name}</span> // Render as text if no link is available
              )}
            </div>
          ))
        ) : (
          <div className="subcategory-message">
            <span>Customize {parentCategoryName} Now !</span> {/* Fallback message if no subcategories */}
          </div>
        )}
      </div>
      <div className="subcategory-image">
        <Image
          src={hoveredSubCategory || parentCategoryImage} // Display hovered subcategory image or parent category image
          alt="Category Image"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
};

export default SubCategories;
