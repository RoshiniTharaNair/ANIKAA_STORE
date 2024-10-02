"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./DiscountCarousel.module.css";

interface Discount {
  src?: string;
  videoSrc?: string;
  alt: string;
  text1: string;
  text2: string;
  highlight: string;
  fontClass1: string;
  fontClass2: string;
  positionClass: string;
  textColor1: string;
  textColor2: string;
  highlightColor: string;
  shadowColor1: string;
  shadowColor2: string;
}

const discounts: Discount[] = [
  { 
    src: "/discount10.jpg", 
    alt: "Discount 1", 
    text1: "50% off on custom Blouses!", 
    text2: "Upgrade your wardrobe today.", 
    highlight: "50% off", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-pacifico", 
    positionClass: "center", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#f75799", 
    shadowColor1: "#000", 
    shadowColor2: "#000" 
  },
  { 
    src: "/discount11.jpg", 
    alt: "Discount 2", 
    text1: "Buy 1 Get 1 Free on tailored Gowns!", 
    text2: "Limited time offer.", 
    highlight: "Buy 1 Get 1 Free", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-sofia", 
    positionClass: "left", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#45021f", 
    shadowColor1: "#000", 
    shadowColor2: "#000" 
  },
  { 
    src: "/discount16.jpg", 
    alt: "Discount 6", 
    text1: "20% off on bespoke Kurtas!", 
    text2: "Style and comfort in one.", 
    highlight: "20% off", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-pacifico", 
    positionClass: "center", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#a84f74", 
    shadowColor1: "", 
    shadowColor2: "#000" 
  },
  { 
    src: "/discount17.jpg", 
    alt: "Discount 7", 
    text1: "Exclusive 20% discount on custom Lehengas!", 
    text2: "Perfect for any occasion.", 
    highlight: "20% discount", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-sofia", 
    positionClass: "center", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#a84f74", 
    shadowColor1: "#000", 
    shadowColor2: "#000" 
  },
  { 
    src: "/discount18.jpg", 
    alt: "Discount 8", 
    text1: "Enjoy 20% off on all tailored items!", 
    text2: "Elevate your style with custom fits.", 
    highlight: "20% off", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-pacifico", 
    positionClass: "center", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#a84f74", 
    shadowColor1: "#000", 
    shadowColor2: "#000" 
  },
  { 
    src: "/discount19.jpg", 
    alt: "Discount 9", 
    text1: "Special offer: 20% off on new arrivals!", 
    text2: "Tailored to your taste.", 
    highlight: "Special offer", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-sofia", 
    positionClass: "center", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#a84f74", 
    shadowColor1: "#000", 
    shadowColor2: "#000" 
  },
  { 
    videoSrc: "/bg_video15.mp4", 
    alt: "Discount 7", 
    text1: "Exclusive 20% discount on custom Lehengas!", 
    text2: "Perfect for any occasion.", 
    highlight: "20% discount", 
    fontClass1: "font-lato-heavy", 
    fontClass2: "font-sofia", 
    positionClass: "center", 
    textColor1: "#fff", 
    textColor2: "#ffffff", 
    highlightColor: "#a84f74", 
    shadowColor1: "#000", 
    shadowColor2: "#000" 
  }
];

const DiscountCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % discounts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + discounts.length) % discounts.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current && discounts[currentSlide].videoSrc) {
      const handleVideoEnd = () => nextSlide();
      videoRef.current.addEventListener('ended', handleVideoEnd);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('ended', handleVideoEnd);
        }
      };
    }
  }, [currentSlide]);

  return (
    <div className={styles.carouselContainer}>
      {discounts.map((discount, index) => (
        <div
          key={index}
          className={`${styles.carouselSlide} ${
            index === currentSlide ? styles.activeSlide : ""
          }`}
        >
          {discount.videoSrc ? (
            <video ref={videoRef} src={discount.videoSrc} autoPlay muted className={styles.carouselVideo}></video>
          ) : (
            discount.src && (
              <Image src={discount.src} alt={discount.alt} layout="fill" objectFit="cover" />
            )
          )}
          <div className={`${styles.overlay} ${styles[discount.positionClass]}`}>
            <div className={`${discount.fontClass1} ${styles.text1}`} style={{ color: discount.textColor1, textShadow: discount.shadowColor1 ? `2px 2px 4px ${discount.shadowColor1}` : 'none' }}>
              {discount.text1.split(discount.highlight).map((part, i) => (
                <span key={i} style={{ color: i % 2 === 0 ? discount.textColor1 : discount.highlightColor }}>
                  {i % 2 === 0 ? part : discount.highlight}
                </span>
              ))}
            </div>
            <div className={`${discount.fontClass2} ${styles.text2}`} style={{ color: discount.textColor2, textShadow: discount.shadowColor2 ? `2px 2px 4px ${discount.shadowColor2}` : 'none' }}>
              {discount.text2}
            </div>
            <button className={`${styles.exploreButton} ${styles.fontLatoSofia}`}>Explore Now</button>
          </div>
        </div>
      ))}
      <button className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`} onClick={prevSlide}>&lt;</button>
      <button className={`${styles.carouselArrow} ${styles.carouselArrowRight}`} onClick={nextSlide}>&gt;</button>
      <div className={styles.carouselIndicators}>
        {discounts.map((_, index) => (
          <div
            key={index}
            className={`${styles.carouselIndicator} ${
              index === currentSlide ? styles.activeIndicator : ""
            }`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DiscountCarousel;
