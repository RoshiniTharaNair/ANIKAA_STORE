"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import './Hero.css';

const Hero = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);
  const router = useRouter();

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const handleLoadedMetadata = () => {
        const videoDuration = videoRef.current?.duration;
        console.log(`Video duration: ${videoDuration} seconds`);

        // Set a timeout to scroll to the DiscountCarousel component
        if (videoDuration) {
          setTimeout(() => {
            scrollToDiscountCarousel();
          }, videoDuration * 1000);
        }
      };

      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, []);

  const navigateToStore = () => {
    console.log("clicked navigate to store")
    router.push('/explore/store');
  };

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDiscountCarousel = () => {
    const discountCarousel = document.getElementById('discount-carousel');
    if (discountCarousel) {
      discountCarousel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-container">
      <video 
        ref={videoRef}
        className="fullscreen-video"
        src="/bg_video21.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
      ></video>
      <div className="video-overlay"></div>
      <div className="banner-text">
        <h1 className="font-sofia">Create Your Perfect Dress</h1>
        <p className="font-sofia">
          Share your design, and we&apos;ll tailor it to perfection.
        </p>
        <button className="scroll-button" onClick={navigateToStore}>Discover More</button>
      </div>
    </div>
  );
};

export default Hero;
