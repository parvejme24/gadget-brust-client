import React from "react";

import { FaBabyCarriage } from "react-icons/fa";
import { CiCreditCard2 } from "react-icons/ci";
import { TbTruckReturn } from "react-icons/tb";
import { MdSupportAgent } from "react-icons/md";

export default function Speciality() {
  return (
    <div className="py-10">
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex items-center gap-5 bg-[#F5F5F5] px-8 py-5 rounded">
          <FaBabyCarriage className="text-4xl text-[#5BBB97]" />
          <div>
            <h3 className="text-lg font-semibold">Free Shipping</h3>
            <p className="text-[#838080]">
              Free shipping on all orders over $100
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-[#F5F5F5] p-5 rounded">
          <CiCreditCard2 className="text-4xl text-[#5BBB97]" />
          <div>
            <h3 className="text-lg font-semibold">Secure Payment</h3>
            <p className="text-[#838080]">Secure payment with SSL encryption</p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-[#F5F5F5] p-5 rounded">
          <TbTruckReturn className="text-4xl text-[#5BBB97]" />
          <div>
            <h3 className="text-lg font-semibold">Free Returns</h3>
            <p className="text-[#838080]">Free returns within 30 days</p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-[#F5F5F5] p-5 rounded">
          <MdSupportAgent className="text-4xl text-[#5BBB97]" />
          <div>
            <h3 className="text-lg font-semibold">24/7 Support</h3>
            <p className="text-[#838080]">Support available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
