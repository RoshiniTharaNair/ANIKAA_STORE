"use client";

import React, { useEffect, useRef, useState } from "react";
import { ProductProvider } from "@/lib/context/product-context";
import { useIntersection } from "@/lib/hooks/use-in-view";
import ProductInfo from "./product-info";
import ProductTabs from "../components/product-tabs";
import ImageGallery from "../components/image-gallery";
import MobileActions from "../components/mobile-actions";
import ProductOnboardingCta from "../components/product-onboarding-cta";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import ProductActions from "../components/product-actions";
import Medusa from "@medusajs/medusa-js";
import { MEDUSA_BACKEND_URL } from "@/lib/config";
import { Suspense } from "react";
import RelatedProducts from "@/components/products/components/related-products";
import ProductDescription from "./product-description";
import axios from 'axios';

type ProductTemplateProps = {
  product: PricedProduct;
};

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [retrievedProduct, setRetrievedProduct] = useState<PricedProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [variantImages, setVariantImages] = useState<any[]>([]);

  const infoRef = useRef<HTMLDivElement>(null);
  const inView = useIntersection(infoRef, "0px");

  const reviewsRef = useRef<HTMLDivElement>(null);

  const productId: string = product.id!;

  useEffect(() => {
    if (!retrievedProduct || retrievedProduct.id !== productId) {
      medusa.products.retrieve(productId)
        .then(({ product }) => {
          setRetrievedProduct(product);
        })
        .catch(error => {
          console.error("Error fetching product details: ", error);
        });
    }
  }, [productId, retrievedProduct]);

  useEffect(() => {
    console.log('selectedVariant ImageGallery', selectedVariant); // Log the selected variant
    
    const fetchVariantImages = async () => {
      setVariantImages([]); // Clear variant images at the start
      let images = [];

      try {
        const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/variantimages`, {
          params: { variant_id: selectedVariant.id }
        });
        if (response.data.data.length > 0 && response.data.data[0].image_urls) {
          console.log('response.data.data', response.data.data);
          images = response.data.data[0].image_urls.map(url => ({ id: selectedVariant.id, url }));
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }

      setVariantImages(images);
    };

    if (selectedVariant) {
      fetchVariantImages();
    }
  }, [selectedVariant]);

  const handleVariantChange = (variant: any) => {
    console.log('variant ProductTemplate', variant)
    setSelectedVariant(variant);
  };

  console.log('variantImages', variantImages);
  
  return (
    <ProductProvider product={retrievedProduct || product}>
<div className="content-container flex flex-col small:flex-row small:items-start py-6 relative md:items-center" style={{ marginTop: "80px", display: "flex" }}>
{/* Add margin-right to increase the gap between the image gallery and the product info */}
        <div
  className="block w-full sm:w-2/5 md:w-3/5 lg:w-4/5 xl:w-1/2 relative lg:mr-[5px]"
>
  <ImageGallery images={product?.images || []} />
</div>


        <div
  className="flex flex-col small:sticky small:top-28 small:py-0 w-full py-0 gap-y-2"
  ref={infoRef}
  style={{
    marginTop: "20px",
    maxWidth: "500px", // Increase max-width here
    width: "100%", // Ensure it takes up full width
  }}
>
  <ProductInfo
    onReviewsClick={() =>
      reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    product={retrievedProduct || product}
  />
  {isOnboarding && <ProductOnboardingCta />}
  <ProductActions
    product={retrievedProduct || product}
    onVariantChange={handleVariantChange}
  />
</div>

      </div>
      
      <div className="content-container">
        <div className="mb-8 mt-8">
          <ProductDescription product={retrievedProduct || product} />
        </div>
        <div className="mb-4 mt-5">
          <ProductTabs product={retrievedProduct || product} />
        </div>
      </div>

      <div className="content-container my-16 px-6 small:px-8 small:my-32">
        <Suspense fallback={<div>Loading...</div>}>
          <RelatedProducts product={retrievedProduct || product} />
        </Suspense>
      </div>
    </ProductProvider>
  );
};

export default ProductTemplate;
