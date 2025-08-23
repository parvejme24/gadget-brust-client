import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

import gaggetsImage from "@/assets/gaggets.png";
import newsletterBg from "@/assets/newsletter-bg.svg";
import Image from "next/image";

export default function Newsletter() {
  return (
    <div className="py-10 bg-[#F5F5F5] relative overflow-hidden">
      {/* background images with low z-index */}
      <Image
        src={newsletterBg}
        alt="newsletter-bg"
        className="absolute top-0 left-0 z-0 opacity-30"
        draggable={false}
      />
      <Image
        src={newsletterBg}
        alt="newsletter-bg"
        className="absolute bottom-0 right-0 rotate-180 z-0 opacity-30"
        draggable={false}
      />

      {/* main content with high z-index */}
      <div className="container mx-auto max-w-7xl px-5 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-5 items-center relative z-10">
        <div>
          <h3 className="text-2xl font-semibold">Newsletter</h3>
          <p className="text-[#908D8D] text-lg mt-2">
            Subscribe for latest stories and promotions
          </p>
          <div className="flex items-center mt-5">
            <Input
              type="text"
              placeholder="Your email address..."
              className="py-5 px-4 bg-white"
            />
            <Button className="bg-[#5BBB97] hover:bg-[#46947A] cursor-pointer text-white h-10 -ml-5">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Image src={gaggetsImage} alt="gaggets" draggable={false} />
        </div>
      </div>
    </div>
  );
}
