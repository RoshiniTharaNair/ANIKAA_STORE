"use client";

import React, { useEffect } from 'react'; // Import useEffect
import Hero from '@/components/home/components/hero';
import DiscountCarousel from '@/components/home/components/discount-carousel';
import FeaturedCategories from '@/components/home/components/featured-categories';

export default function Home() {
 // Scroll to top on component mount
 useEffect(() => {
    window.scrollTo(0, 0);
 }, []); // Empty dependency array ensures this runs once on mount

 // const { collections, count } = await getCollectionsList(0, 3)

 return (
    <>
    
      <Hero />
      <DiscountCarousel />
      <FeaturedCategories />
      {/* <AccessoriesCarousel /> */}
  </>
  );
}
