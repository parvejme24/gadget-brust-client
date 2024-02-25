import React from "react";
import car from "../../../assets/icons/car.png";
import returnIcon from "../../../assets/icons/return.png";
import support from "../../../assets/icons/support.png";
import walet from "../../../assets/icons/walet.png";

const usualData = [
  {
    id: 1,
    icon: car,
    heading: "Free Shipping",
    subHeading: "Capped at $39 per order",
  },
  {
    id: 2,
    icon: walet,
    heading: "Secure Payments",
    subHeading: "Up to 12 months installments",
  },
  {
    id: 3,
    icon: returnIcon,
    heading: "10-Days Return",
    subHeading: "Shop with confidence",
  },
  {
    id: 4,
    icon: support,
    heading: "24/7 Supports",
    subHeading: "Available for you",
  },
];

export default function Usual() {
  return (
    <div className="container mx-auto">
      <div className="mx-4 lg:mx-0 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-0">
        {usualData.map((item) => (
          <div key={item.id} className="flex items-center gap-4 primaryBG p-4">
            <img src={item.icon} alt="" />
            <div>
              <h3 className="text-[#343a40] text-xl font-semibold">
                {item.heading}
              </h3>
              <p className="text-[#908D8D] text-md">{item.subHeading}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
