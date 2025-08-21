"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";

const bannerData = [
  {
    id: 1,
    title: "MacBook Air M1 New",
    short_des:
      "Apple MacBook Air 13.3-Inch Retina Display 8-core Apple M1 chip with 8GB RAM, 256GB SSD (MGND3) Gold",
    price: "50% off in all products",
    image:
      "https://ecommerce-api.codesilicon.com/images/s15ab2733cb4567d3d.png",
    product_id: 1,
    created_at: "2023-08-15T12:42:46.000000Z",
    updated_at: "2024-10-02T17:18:49.000000Z",
  },
  {
    id: 3,
    title: "MacBook Air M1 New",
    short_des:
      "Apple MacBook Air 13.3-Inch Retina Display 8-core Apple M1 chip with 8GB RAM, 256GB SSD (MGND3) Gold",
    price: "51% off in all products",
    image:
      "https://ecommerce-api.codesilicon.com/images/s29b413a4aec6bec14.png",
    product_id: 2,
    created_at: "2023-08-15T12:42:46.000000Z",
    updated_at: "2024-10-02T17:19:54.000000Z",
  },
  {
    id: 4,
    title: "MacBook Air M1 New",
    short_des:
      "Apple MacBook Air 13.3-Inch Retina Display 8-core Apple M1 chip with 8GB RAM, 256GB SSD (MGND3) Gold",
    price: "52% off in all products",
    image:
      "https://ecommerce-api.codesilicon.com/images/s36372954997b5719f.png",
    product_id: 3,
    created_at: "2023-08-15T12:42:46.000000Z",
    updated_at: "2024-10-02T17:19:01.000000Z",
  },
];

export default function Banner() {
  return (
    <div className="relative">
      {/* Swiper Slider */}
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="h-[500px] sm:h-[600px] md:h-[700px]"
      >
        {bannerData.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="relative w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

              {/* content container */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col h-full justify-center">
                    {/* Content - Left aligned */}
                    <div className="text-left max-w-2xl">
                      {/* discount badge */}
                      <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        {item.price}
                      </div>

                      {/* title */}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {item.title}
                      </h1>

                      {/* description */}
                      <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                        {item.short_des}
                      </p>

                      {/* call to action buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={`/product/${item.product_id}`}
                          className="inline-block bg-[#38AD81] hover:bg-[#38AD81]/90 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
                        >
                          Shop Now
                        </Link>
                        <Link
                          href={`/product/${item.product_id}`}
                          className="inline-block bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-gray-900 text-lg"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
        <FaChevronLeft className="text-xl" />
      </button>

      <button className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
        <FaChevronRight className="text-xl" />
      </button>

      {/* Custom Pagination */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
}
