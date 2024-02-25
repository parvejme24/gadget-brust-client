import React from "react";
import car from "../../../assets/icons/car.png";
import returnIcon from "../../../assets/icons/return.png";
import support from "../../../assets/icons/support.png";
import walet from "../../../assets/icons/walet.png";

export default function Usual() {
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:px-0">
      <div className="flex items-center gap-4 bg-gray-100 p-4">
        <img src={car} alt="" />
        <div>
          <h3 className="text-[#343a40] text-2xl font-semibold">
            Free Shipping
          </h3>
          <p className="text-[#908D8D] text-lg">Capped at $39 per order</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-100 p-4">
        <img src={walet} alt="" />
        <div>
          <h3 className="text-[#343a40] text-2xl font-semibold">
            Secure Payments
          </h3>
          <p className="text-[#908D8D] text-lg">
            Up to 12 months installments{" "}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-100 p-4">
        <img src={returnIcon} alt="" />
        <div>
          <h3 className="text-[#343a40] text-2xl font-semibold">
            10-Days Return
          </h3>
          <p className="text-[#908D8D] text-lg">Shop with confidence</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gray-100 p-4">
        <img src={support} alt="" />
        <div>
          <h3 className="text-[#343a40] text-2xl font-semibold">
            24/7 Supports
          </h3>
          <p className="text-[#908D8D] text-lg">Available for you</p>
        </div>
      </div>
    </div>
  );
}
