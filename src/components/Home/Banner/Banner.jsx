import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import banner from "../../../assets/banner-bg.png";

const bannerData = [
  {
    image:
      "https://m.media-amazon.com/images/I/71lrSsFkE7L.__AC_SY445_SX342_QL70_FMwebp_.jpg",
    subtitle: "best headphone in 2024",
    title: "MOVSSOU E7 Active Noise Cancelling Headphone",
  },
  {
    image:
      "https://m.media-amazon.com/images/I/71lrSsFkE7L.__AC_SY445_SX342_QL70_FMwebp_.jpg",
    subtitle: "best headphone in 2024",
    title: "MOVSSOU E7 Active Noise Cancelling Headphone",
  },
  {
    image:
      "https://m.media-amazon.com/images/I/71lrSsFkE7L.__AC_SY445_SX342_QL70_FMwebp_.jpg",
    subtitle: "best headphone in 2024",
    title: "MOVSSOU E7 Active Noise Cancelling Headphone",
  },
  {
    image:
      "https://m.media-amazon.com/images/I/71lrSsFkE7L.__AC_SY445_SX342_QL70_FMwebp_.jpg",
    subtitle: "best headphone in 2024",
    title: "MOVSSOU E7 Active Noise Cancelling Headphone",
  },
  {
    image:
      "https://m.media-amazon.com/images/I/71lrSsFkE7L.__AC_SY445_SX342_QL70_FMwebp_.jpg",
    subtitle: "best headphone in 2024",
    title: "MOVSSOU E7 Active Noise Cancelling Headphone",
  },
];

export default function Banner() {
  return (
    <div className="banner-bg">
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {bannerData.map((item) => (
          <SwiperSlide>
            <div className="container mx-auto grid grid-cols-2 justify-between items-center py-14 md:py-28 px-3 md:px-0">
              <div className="space-y-4">
                <h4 className="uppercase text-lg md:text-xl text-red-600">
                  {item.subtitle}
                </h4>
                <h2 className="text-4xl textShadow capitalize font-semibold hidden md:flex">
                  {item.title}
                </h2>
                <button className="secondaryBG shadow-md text-white px-4 py-2 rounded-md">
                  Buy Now
                </button>
              </div>
              <div className="flex justify-center items-center">
                <img src={item.image} alt="" className="max-w-[70%]" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
