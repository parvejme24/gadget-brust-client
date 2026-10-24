import Banner from "@/components/Module/Home/Banner/Banner";
import Speciality from "@/components/Module/Home/Speciality/Speciality";
import CategoryShowcase from "@/components/Module/Home/CategoryShowcase/CategoryShowcase";
import FlashDeals from "@/components/Module/Home/FlashDeals/FlashDeals";
import PromoBanners from "@/components/Module/Home/PromoBanners/PromoBanners";
import ProductTabs from "@/components/Module/Home/ProductTabs/ProductTabs";
import BrandMarquee from "@/components/Module/Home/BrandMarquee/BrandMarquee";
import Newsletter from "@/components/Shared/Newsletter/Newsletter";
import React from "react";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Speciality />
      <CategoryShowcase />
      <FlashDeals />
      <PromoBanners />
      <ProductTabs />
      <BrandMarquee />
      <Newsletter />
    </div>
  );
}
