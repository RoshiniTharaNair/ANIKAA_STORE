"use client";

import { Image as MedusaImage } from "@medusajs/medusa";
import { Container } from "@medusajs/ui";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageGalleryProps = {
  images: MedusaImage[];
};

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [aspectRatio, setAspectRatio] = useState("29 / 34");

  useEffect(() => {
    // This code will only run on the client-side
    const updateAspectRatio = () => {
      if (window.innerWidth <= 640) {
        setAspectRatio("25 / 34");
      } else {
        setAspectRatio("29 / 34");
      }
    };

    // Set initial aspect ratio based on the window size
    updateAspectRatio();

    // Add event listener for resizing window
    window.addEventListener("resize", updateAspectRatio);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateAspectRatio);
    };
  }, []);

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
              // Use responsive aspect ratio
              style={{
                aspectRatio, // Use the state value for the aspect ratio
              }}
            >
              <Image
                src={image.url}
                priority={index <= 2 ? true : false}
                className="absolute inset-0 rounded-rounded"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                style={{
                  objectFit: "cover",
                }}
              />
            </Container>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;
