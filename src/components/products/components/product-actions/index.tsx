"use client";

import {
  ProductProvider,
  useProductActions,
} from "@/lib/context/product-context";
import useProductPrice from "@/lib/hooks/use-product-price";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { Button } from "@medusajs/ui";
import Divider from "@/components/common/components/divider";
import OptionSelect from "@/components/products/components/option-select";
import clsx from "clsx";
// Additional imports to include addToWishlist feature, discount display feature, and product category feature
import React, { useMemo, useState, useEffect } from "react";
import Wishlist from "../../../common/icons/wishlist";
import { LineItem as MedusaLineItem } from "@medusajs/medusa";

import { getWishListItem } from "./getWishListItem";
import { postToWishlist } from "./postToWishlist";
import { useRouter } from "next/navigation";
import SignInPrompt from "../sign-in-prompt";
import { getWishList } from "./getWishlist";
import { useCart, useMeCustomer } from "medusa-react";
import { useWishlistDropdownContext } from "@/lib/context/wishlist-dropdown-context";
import { useStore } from "@/lib/context/store-context";
import Medusa from "@medusajs/medusa-js";
import { useProductCategories } from "medusa-react";
import axios from "axios";
// import { getDiscountList } 
import { MEDUSA_BACKEND_URL } from "@/lib/config";
import SizeChartDialog from "../size-chart-dialog";
// import DressFashionBlogger from "@/public/dress-fashion-blogger.svg";
import X from "@/components/common/icons/x";
import Link from "next/link";

type ProductActionsProps = {
  product: PricedProduct;
  onVariantChange?: (variant: any) => void; // Make onVariantChange optional
};

type ProductActionsInnerProps = {
  product: PricedProduct;
  onVariantChange: (variant: any) => void;
};

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}


type WishlistProps = {
  fill: string;
};

interface FavoriteItem {
  id: string;
  customer_id: string;
  variant_id: string;
  email: string;
  created_at: string;
}

type WishlistItem = {
  id: string | undefined;
  variant_id: string | undefined;
  size: string | undefined;
  title: string | undefined;
  thumbnail: string | null | undefined;
  handle: string | null | undefined;
};

type ListItem = {
  id: string | undefined;
  variant_id: string | undefined;
  size: string | undefined;
  title: string | undefined;
  thumbnail: string | null | undefined;
  handle: string | null | undefined;
};

type CategoryWithProducts = {
  id: string;
  name: string;
  handle: string;
  productIds: string[];
};

type AncestorCategory = {
  id: string;
  name: string;
  handle: string;
};

interface Discount {
  value: number;
  type: string;
  code: string;
}

interface ExtendedLineItem extends MedusaLineItem {
  design_images?: string[];
  design_preference?: string;
}

type DiscountsArray = Discount[];

function generateId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}-${randomNum}`;
}

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

const UploadImageSuccessModal = ({ onClose, productName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="relative bg-white rounded-lg p-8 w-96 max-w-full text-center shadow-xl transform transition-all duration-500 ease-in-out scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-300"
          aria-label="Close"
          style={{ cursor: "pointer" }}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="mb-6">
          <img src="/dress-fashion-blogger.svg" alt="Dress Fashion Blogger" className="w-20 h-20 mx-auto mb-4" />
          <p className="text-gray-600">Design images for your <span className="font-bold">{productName}</span> have been uploaded successfully!</p>
        </div>
      </div>
    </div>
  );
};


const UploadPreferenceSuccessModal = ({ onClose, productName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="relative bg-white rounded-lg p-8 w-96 max-w-full text-center shadow-xl transform transition-all duration-500 ease-in-out scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-300"
          aria-label="Close"
          style={{ cursor: "pointer" }}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="mb-6">
          <img src="/dress-fashion-blogger.svg" alt="Dress Fashion Blogger" className="w-20 h-20 mx-auto mb-4" />
          <p className="text-gray-600">Design preference for your <span className="font-bold">{productName}</span> is updated successfully!</p>
        </div>
      </div>
    </div>
  );
};



const ProductActionsInner: React.FC<ProductActionsInnerProps> = ({ product, onVariantChange }) => {
  const { updateOptions, addToCart, options, inStock, variant } = useProductActions();
  const price = useProductPrice({ id: product.id!, variantId: variant?.id });
  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price;
    return variantPrice || cheapestPrice || null;
  }, [price]);

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const { customerId, setCustomerId, totalItems, setTotalItems } = useWishlistDropdownContext();
  const { customer } = useMeCustomer();
  const { deleteItem } = useStore();
  const variantId = variant?.id;
  const inWishlist = getWishListItem(customerId, variantId);
  const [buyGetNumber, setBuyGetNumber] = useState<number | null>(null);
  const [buyGetOffer, setBuyGetOffer] = useState<number | null>(null);
  const [salesQuantity, setSalesQuantity] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { listItems, setListItems } = useWishlistDropdownContext();
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [designImages, setDesignImages] = useState<string[]>([]);
  const [hasImageChanges, setHasImageChanges] = useState(false); // New state to track changes in images
  const [showSuccessNotification, setShowSuccessNotification] = useState(false); // State to manage success notification visibility
  const [showUploadImageSuccessModal, setShowUploadImageSuccessModal] = useState(false); // State for managing modal visibility
  const [hasPreferenceChanges, setHasPreferenceChanges] = useState(false); // New state to track changes in design preferences
  const [showUploadPreferenceSuccessModal, setShowUploadPreferenceSuccessModal] = useState(false);


  const productId: string = product.id!;

  useEffect(() => {
    medusa.products.retrieve(productId)
      .then(({ product }) => {
        setBuyGetNumber(product?.buy_get_num || null);
        setBuyGetOffer(product?.buy_get_offer || null);
        setSalesQuantity(product?.sales_quantity || null);
        setDiscountCode(product.discountCode || null);
      })
      .catch(error => {
        console.error("Error fetching product details: ", error);
      });
  }, []);

  useEffect(() => {
    onVariantChange(variant);
  }, [variant]);


  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setHasPreferenceChanges(true); // Track changes to the design preference
  };

  const updateDesignPreferenceForItem = async () => {
    if (!matchingItem) {
      console.log("No matching item found for variant ID:", variantId);
      return;
    }

    const requestBody = {
      id: matchingItem.id,
      design_preference: description,
    };

    try {
      await axios.post("http://localhost:9000/store/updateDesignPreference", requestBody);
      setShowUploadPreferenceSuccessModal(true); // Show success modal when design preference is updated
    } catch (error) {
      console.error("Error updating design preference:", error);
    }
  };
  
  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]); // Change to File type for uploading

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedImages(Array.from(files));
      setHasImageChanges(true); // Set change tracker to true if images are uploaded
    }
  };

  // Remove a specific uploaded image by its index
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      setHasImageChanges(updatedImages.length > 0 || designImages.length > 0); // Update change tracker based on current state
      return updatedImages;
    });
  };

  // Remove a specific design image (from matchingItem) by its index
  const handleRemoveDesignImage = (index: number) => {
    setDesignImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      setHasImageChanges(updatedImages.length > 0 || uploadedImages.length > 0); // Update change tracker based on current state
      return updatedImages;
    });
  };

  // const handleRemoveImage = () => setUploadedImage(null);

  const checkWishlist = async () => {
    const inWishlist = await getWishListItem(customer?.id, variant?.id);
    setIsInWishlist(inWishlist || false);
  };

  if (customer?.id && variant?.id) {
    checkWishlist();
  }

  const getListItem = async (item: FavoriteItem): Promise<ListItem> => {
    const response = await medusa.products.variants.retrieve(item.variant_id);
    const variant = response.variant;
    return {
      id: item.id,
      variant_id: variant.id,
      size: variant.title,
      title: variant.product?.title,
      thumbnail: variant.product?.thumbnail,
      handle: variant.product?.handle,
    };
  };

  const handleAddToWishlist = async () => {
    if (!customer?.id) {
      setShowSignInPrompt(true);
      return;
    }
    postToWishlist(customer?.id, customer?.email, variant?.id);
    const response = await getWishList(customer?.id);
    setIsInWishlist(!isInWishlist);
    setMessage(isInWishlist ? 'Remove from wishlist' : 'Add to wishlist');
    setTotalItems(response.wishlist.length);
    if (response.wishlist && Array.isArray(response.wishlist)) {
      const wishlistPromises = response.wishlist.map(getListItem);
      const wishlistItems = await Promise.all(wishlistPromises);
      setListItems(wishlistItems);
    }
  };

  const handleData = async () => {
    try {
      const response = await getWishList(customer?.id);
      return response || { wishlist: [] };
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return { wishlist: [] };
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchWishlist = async () => {
      const data = await handleData();
      if (data?.wishlist && Array.isArray(data.wishlist)) {
        data.wishlist.forEach((item: FavoriteItem) => {
          medusa.products.variants.retrieve(item.variant_id)
            .then(({ variant }) => {
              if (isCancelled) return;
              setWishlistItems((prevItems) => {
                const itemExists = prevItems.some((prevItem) => prevItem.id === item.id);
                if (itemExists) {
                  return prevItems;
                } else {
                  return [
                    ...prevItems,
                    {
                      id: item.id,
                      variant_id: variant.id,
                      size: variant.title,
                      title: variant.product?.title,
                      thumbnail: variant.product?.thumbnail,
                      handle: variant.product?.handle,
                    },
                  ];
                }
              });
            })
            .catch((error) => console.error("Error fetching variant details:", error));
        });
      } else {
        console.log("Wishlist data is not in expected format:", data);
      }
    };
    fetchWishlist();
    return () => {
      isCancelled = true;
    };
  }, [customer?.id]);

  const [quantity, setQuantity] = useState<number | undefined>(undefined);

  medusa.products.variants.list().then(({ variants }) => {
    const variant = variants.find((variant) => variant.product_id === product.id);
    if (variant) {
      setQuantity(variant.inventory_quantity);
    }
  });

  const { cart } = useCart();

  console.log("cart ",cart)
  const isInCart = (cart?.items.some((item) => item.variant_id === variant?.id)) ?? false;

  const matchingItem = cart?.items.find((item) => item.variant_id === variantId) as ExtendedLineItem;

  console.log("matchingItem ",matchingItem)

  console.log("matchingItem ",matchingItem?.design_images)
  console.log("matchingItem ",matchingItem?.design_preference)

  useEffect(() => {
    if (matchingItem) {
      if (matchingItem.design_preference) {
        setDescription(matchingItem.design_preference);
      }
      if (matchingItem.design_images) {
        setDesignImages(matchingItem.design_images);
      }
    }
  }, [matchingItem]);

  const deleteCartItem = (variantId: any) => {
    const itemToDelete = cart?.items.find((item) => item.variant_id === variant?.id);
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
    }
  };

  const uploadDesignImages = async () => {
    const formData = new FormData();

    // Append all selected images to formData
    uploadedImages.forEach((image, index) => {
        formData.append(`design_images_${index}`, image);
    });

    try {
        // Call the image upload API
        const response = await axios.post("http://localhost:9000/store/designImageUpload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Extract the image URLs from the response
        const imageUrls = response.data.files;
        return Object.values(imageUrls).flat().map((file: any) => file.url);
    } catch (error) {
        console.error("Error uploading design images:", error);
        throw new Error("Image upload failed");
    }
};

// const updateDesignImagesForItem = async () => {
//   if (!matchingItem) {
//       console.log("No matching item found for variant ID:", variantId);
//       return;
//   }

//   // Upload the new images first to get their URLs
//   let newImageUrls = [];
//   try {
//       newImageUrls = await uploadDesignImages();
//   } catch (error) {
//       console.error("Failed to upload new images:", error);
//       return;
//   }

//   // Create the final list of images to send to the API
//   const updatedDesignImages = [...designImages, ...newImageUrls];

//   console.log("Matching Line Item ID: ", matchingItem.id);
//   console.log("Updated Design Images: ", updatedDesignImages);

//   // Prepare the request body for the update API
//   const requestBody = {
//       id: matchingItem.id,
//       design_images: updatedDesignImages,
//   };

//   // Make the API request to update design preferences
//   try {
//       const response = await axios.post(
//           "http://localhost:9000/store/updateDesignPreference",
//           requestBody
//       );
//       console.log("Design Preference Update Response:", response.data);
//   } catch (error) {
//       console.error("Error updating design preferences:", error);
//   }
// };

const updateDesignImagesForItem = async () => {
  if (!matchingItem) {
    console.log("No matching item found for variant ID:", variantId);
    return;
  }

  let newImageUrls = [];
  try {
    newImageUrls = await uploadDesignImages();
  } catch (error) {
    console.error("Failed to upload new images:", error);
    return;
  }

  const updatedDesignImages = [...designImages, ...newImageUrls];

  const requestBody = {
    id: matchingItem.id,
    design_images: updatedDesignImages,
  };

  try {
    await axios.post("http://localhost:9000/store/updateDesignPreference", requestBody);
    setHasImageChanges(false);
    setShowUploadImageSuccessModal(true); // Show success modal
  } catch (error) {
    console.error("Error updating design preferences:", error);
  }
};


  const handleAddToCart = async () => {
    if (variant) {
      try {
        // Upload images and get URLs
        const imageUrls = await uploadDesignImages();

        // Log details and call addToCart
        console.log("Adding to Cart - Variant ID: ", variant.id, " Quantity: ", quantity, " Design Preferences: ", description, " Image URLs: ", imageUrls);
        addToCart(variant.id, description, imageUrls);
      } catch (error) {
        console.error("Failed to add item to cart due to image upload issue:", error);
      }
    }
  };

  const inventory_quantity = variant?.inventory_quantity;

  const variantOptionValues = variant?.options.map((variantOption) => {
    const productOption = product.options?.find((option) => option.id === variantOption.option_id);
    if (!productOption) {
      return null;
    }
    return {
      ...productOption,
      selectedValue: variantOption.value,
    };
  }).filter((option) => option !== null);

  const [matchingCategoryId, setMatchingCategoryId] = useState<string | null>(null);
  const { product_categories } = useProductCategories();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);

  // console.log("matchingCategoryId ",matchingCategoryId)
  useEffect(() => {
    const fetchProductsForCategories = async () => {
      if (product_categories) {
        const categoriesData = await Promise.all(
          product_categories.map(async (category) => {
            try {
              const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products?category_id[]=${category.id}`);
              const productIds = response.data.products.map((product: PricedProduct) => product.id);
              return {
                id: category.id,
                name: category.name,
                productIds: productIds,
              };
            } catch (error) {
              console.error('Error fetching products for category:', error);
              return null;
            }
          })
        );
        setCategoriesWithProducts(categoriesData.filter((category): category is CategoryWithProducts => category !== null));
      }
    };
    fetchProductsForCategories();
  }, [product_categories]);

  useEffect(() => {
    if (productId) {
      const matchingCategory = categoriesWithProducts.find((category) =>
        category.productIds.includes(productId)
      );
      if (matchingCategory) {
        setMatchingCategoryId(matchingCategory.id);
      } else {
        setMatchingCategoryId(null);
      }
    }
  }, [categoriesWithProducts, productId]);

  const [ancestorCategories, setAncestorCategories] = useState<string[]>([]);
  const [fullAncestorCategories, setFullAncestorCategories] = useState<AncestorCategory[]>([]);

  const fetchAncestorCategories = async (
    categoryId: string,
    accumulatedCategories: AncestorCategory[] = []
  ): Promise<AncestorCategory[]> => {
    try {
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/product-categories/${categoryId}`);
      const categoryData = response.data.product_category;
      const currentCategory: AncestorCategory = {
        id: categoryData.id,
        name: categoryData.name,
        handle: categoryData.handle,
      };
      accumulatedCategories.unshift(currentCategory);
      if (categoryData.parent_category) {
        return fetchAncestorCategories(categoryData.parent_category.id, accumulatedCategories);
      }
      return accumulatedCategories;
    } catch (error) {
      console.error('Error fetching ancestor categories:', error);
      return accumulatedCategories;
    }
  };

  const capitalizeWords = (str: string): string => {
    return str.split('').map((char, index, arr) => {
      if (index === 0 || !arr[index - 1].match(/[a-zA-Z]/)) {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    }).join('');
  };

  const removeOldAncestorName = (
    categories: AncestorCategory[],
    oldAncestorName: string
  ): AncestorCategory[] => {
    return categories.map((category, index) => {
      if (index === 0) {
        return category;
      }
      return {
        ...category,
        name: category.name.replace(new RegExp(`\\b${oldAncestorName}\\b`, 'gi'), '').trim(),
      };
    });
  };

  useEffect(() => {
    if (matchingCategoryId) {
      fetchAncestorCategories(matchingCategoryId).then((ancestors) => {
        if (ancestors.length > 0) {
          const oldAncestorName = ancestors[0].name;
          const updatedAncestors = removeOldAncestorName(ancestors, oldAncestorName);
          setFullAncestorCategories(updatedAncestors);
        }
      });
    }
  }, [matchingCategoryId]);

  const recentCategory = fullAncestorCategories[fullAncestorCategories.length - 1]?.name || '';

  const [discounts, setDiscounts] = useState<DiscountsArray>([]);

  // const fetchDiscounts = async () => {
  //   try {
  //     const discountsResponse = await getDiscountList(productId);
  //     setDiscounts(discountsResponse);
  //   } catch (error) {
  //     console.error("Error fetching discounts: ", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDiscounts();
  // }, []);

  const renderDiscounts = () => {
    if (!discounts || discounts.length === 0) {
      return null;
    }
    const firstDiscount = discounts[0];
    if (!firstDiscount) {
      return null;
    }
    return (
      <div>
        <p style={{ fontSize: "14px", color: "#D7373D" }}>
          Extra {firstDiscount.value}{firstDiscount.type} off with code: {firstDiscount.code}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-2">
      {renderDiscounts()}
      {salesQuantity && salesQuantity > 5 && (
        <p className="mt-1" style={{ color: "red", fontSize: "14px", fontWeight: 600 }}>BESTSELLER</p>
      )}
      <div className="mb-1">
        {selectedPrice ? (
          <div className="flex flex-col text-ui-fg-base">
            {selectedPrice.price_type !== "sale" && (
              <p>
                <span className="text-xl-semi text-black">
                  {selectedPrice.calculated_price}
                </span>
                <span className="pt-1 pl-2" style={{ fontWeight: 400, color: "#666666", fontSize: "14px" }}>
                  Price excl. GST
                </span>
              </p>
            )}
            {selectedPrice.price_type === "sale" ? (
              <>
                <p>
                  <span className="line-through text-black pl-1" style={{ fontSize: "18px", fontWeight: 500 }}>
                    {selectedPrice.original_price}
                  </span>
                  <span className={clsx("text-xl-semi", { "text-red pl-1": selectedPrice.price_type === "sale" })} style={{ fontSize: "20px" }}>
                    {selectedPrice.calculated_price}
                  </span>
                  <span className="pt-1 pl-2" style={{ fontWeight: 400, color: "#666666", fontSize: "14px" }}>
                    Price excl. GST
                  </span>
                </p>
                <p style={{ background: "transparent" }}>
                  <span style={{
                    display: "inline-block",
                    background: "black",
                    color: "white",
                    padding: "1% 3%",
                    fontSize: "15px",
                    lineHeight: "24px",
                    textAlign: "center",
                    fontWeight: 500,
                    marginTop: "10px",
                  }}>
                    SALE -{selectedPrice.percentage_diff}%
                  </span>
                  {recentCategory && (
                    <span style={{
                      display: "inline-block",
                      marginLeft: "6%",
                      background: "#6e323b",
                      color: "white",
                      padding: "1% 3%",
                      fontSize: "14px",
                      lineHeight: "24px",
                      textAlign: "center",
                      fontWeight: 700,
                      marginTop: "10px",
                    }}>
                      {recentCategory}
                    </span>
                  )}
                </p>
              </>
            ) : (
              <p style={{ background: "transparent" }}>
                {recentCategory && (
                  <span style={{
                    display: "inline-block",
                    background: "#6e323b",
                    color: "white",
                    padding: "1% 3%",
                    fontSize: "15px",
                    lineHeight: "24px",
                    textAlign: "center",
                    fontWeight: 700,
                    marginTop: "10px",
                  }}>
                    {recentCategory}
                  </span>
                )}
              </p>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      
      <div>
        {product.variants.length > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={updateOptions}
                  title={option.title}
                />
              </div>
            ))}
            <Divider />
          </div>
        )}
      </div>

  {/* Upload Design's Photo */}
  <div className="flex flex-col gap-y-4">
      {/* Change Design Photos or Upload Design Photos */}

      {showUploadImageSuccessModal && (
        <UploadImageSuccessModal
          onClose={() => setShowUploadImageSuccessModal(false)}
          productName={product.title} // Pass product title as the productName prop
        />
      )}
      {showUploadPreferenceSuccessModal && (
        <UploadPreferenceSuccessModal
          onClose={() => setShowUploadPreferenceSuccessModal(false)}
          productName={product.title} // Pass product title as the productName prop
        />
      )}
      <input
        type="file"
        accept="image/*"
        id="upload"
        style={{ display: "none" }}
        multiple // Allow multiple images to be uploaded
        onChange={handleImageUpload}
      />
      <label
        htmlFor="upload"
        className="cursor-pointer text-center py-3 px-5 border-4 border-[#56242e] hover:border-[#e88b9a] hover:bg-[#e88b9a] hover:text-white shadow-md transition-all duration-300 w-full md:w-[45%] lg:w-full"
        style={{ fontWeight: "500", fontSize: "16px" }}
      >
        {designImages.length > 0 ? "Change Design's Photos" : "Upload Design's Photos"}
      </label>

      {/* Display all existing or newly uploaded images */}
      {designImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {designImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Existing Design ${index + 1}`}
                className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[100px] xl:h-[150px] object-cover rounded-md shadow-lg"
                style={{ objectFit: "cover" }}
              />
              <button
                onClick={() => handleRemoveDesignImage(index)}
                className="absolute top-2 right-2 text-white rounded-full p-1 shadow-lg transition duration-200"
                style={{ fontSize: "20px", lineHeight: "1" }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Show newly uploaded images that have not yet been saved */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded Design ${index + 1}`}
                className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[100px] xl:h-[150px] object-cover rounded-md shadow-lg"
                style={{ objectFit: "cover" }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 text-white rounded-full p-1 shadow-lg transition duration-200"
                style={{ fontSize: "20px", lineHeight: "1" }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Button to upload the changed design images */}
      {hasImageChanges && (
        <button
          onClick={updateDesignImagesForItem}
          className="cursor-pointer text-center py-3 px-5 mt-4 border-4 border-[#56242e] hover:border-[#e88b9a] hover:bg-[#e88b9a] hover:text-white shadow-md transition-all duration-300 w-full md:w-[45%] lg:w-full"
          style={{ fontWeight: "500", fontSize: "16px" }}
        >
          Upload Changed Design Images
        </button>
      )}
    </div>

{/* Description Input */}
<div className="mt-6">
<textarea
        className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        style={{ minHeight: "100px", fontSize: "16px" }}
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Enter your design preferences in your comfortable language..."
      />

      {/* Render button to update or change design preference */}
      {(description || hasPreferenceChanges) && (
        <button
          onClick={updateDesignPreferenceForItem}
          className="cursor-pointer text-center py-3 px-5 mt-4 border-4 border-[#56242e] hover:border-[#e88b9a] hover:bg-[#e88b9a] hover:text-white shadow-md transition-all duration-300 w-full md:w-[45%] lg:w-full"
          style={{ fontWeight: "500", fontSize: "16px" }}
        >
          {hasPreferenceChanges ? "Update Design Preference" : "Change Design Preference"}
        </button>
      )}
</div>

<div className="flex items-center gap-x-2 mt-4 mb-4">
  <Link 
    href="" 
    onClick={handleDialogOpen} 
    className="text-sm md:text-base font-semibold hover:underline text-black-600 hover:text-black-800 transition duration-300 ease-in-out py-2 px-4 border-2 border-black-600 rounded-lg bg-black-50 hover:bg-black-100"
    style={{ cursor: "pointer", display: "inline-block", textAlign: "center" }}
  >
    Enter Your Measurements here
  </Link>
        {matchingCategoryId && (
          <SizeChartDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            productTitle={product.title ?? "Product"}
            categoryId={matchingCategoryId}  // Pass matchingCategoryId here
          />
        )}
      </div>


      {buyGetNumber && buyGetOffer && (
        <div>
          <p style={{ color: "green", letterSpacing: "-0.05em" }}>
            Buy {buyGetNumber} Get {buyGetOffer} % Offer
            {discountCode ? ` using code ${discountCode}` : ''}
          </p>
        </div>
      )}
      {/* {variant && inventory_quantity !== undefined ? (
        inventory_quantity < 8 ? (
          <p className="flex items-center gap-x-2" style={{ color: "red", fontSize: "15px" }}>
            Only {inventory_quantity} left in Stock
          </p>
        ) : (
          <p className="flex items-center gap-x-2" style={{ color: "#696969", fontSize: "15px" }}>
            In Stock
          </p>
        )
      ) : null} */}

{showSignInPrompt && <SignInPrompt />}

      
     {variant && (product.is_giftcard || inStock) && (
        <Button
          onClick={() => {
            if (isInCart) {
              deleteCartItem(variant?.id);
            } else {
              handleAddToCart(); // Use the updated add to cart function
            }
          }}
          disabled={!product.is_giftcard && (!inStock || !variant || isInWishlist)}
          variant="primary"
          className={clsx(
            "w-full h-10 md:w-[45%] lg:w-auto",
            {
              "mustard-yellow": isInCart,
              "other-color": !isInCart,
            }
          )}
          title={isInCart ? "Click to delete item from cart" : ""}
          style={{ borderRadius: "0px", fontSize: "16px", textTransform: "uppercase" }}
        >
          {!product.is_giftcard && !inStock
            ? "Currently Out of stock"
            : !variant
            ? "Currently Out of stock to add to cart"
            : isInCart
            ? "Already in cart"
            : "Add to cart"}
        </Button>
      )}


      {variant && (product.is_giftcard || inStock) && (
        <Button
          onClick={handleAddToWishlist}
          disabled={!inStock || !variant}
          variant="secondary"
          className= "w-full h-10 md:w-[45%] lg:w-auto" // Full width on small screens, 75% width on medium, auto width on large screens
          style={{ borderRadius: "0px", fontSize: "16px", textTransform: "uppercase", background: "#F6F6F6" }}
        >
          {!inStock
            ? "Currently Out of stock"
            : !variant
              ? "Currently Out of stock to add to wishlist"
              : (
                <>
                  {isInWishlist ? (
                    <>
                      <Wishlist fill="red" />  Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <Wishlist fill="" /> Add to Wishlist
                    </>
                  )}
                </>
              )}
        </Button>

      )}

      <style>{`
        .mustard-yellow {
          background-color: #e88b9a;
        }
        .text-red {
          color: RGB(181, 31, 41);
        }
      `}</style>
    </div>
  );
};

const ProductActions: React.FC<ProductActionsProps> = ({ product, onVariantChange = () => { } }) => (
  <ProductProvider product={product}>
    <ProductActionsInner product={product} onVariantChange={onVariantChange} />
  </ProductProvider>
);

export default ProductActions;
