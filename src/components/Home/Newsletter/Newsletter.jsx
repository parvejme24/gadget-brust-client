import React from "react";
import newsletter from "../../../assets/newsletter.png";
import nba from "../../../assets/nb.png";

export default function Newsletter() {
  return (
    <div className="primaryBG relative h-[300px] flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-y-1 z-10 text-center md:text-left">
          <h3 className="text-2xl font-semibold">Newsletter</h3>
          <p className="text-gray-600">
            Subscribe for latest stories and promotions
          </p>
          <form className="shaodw-md flex justify-center md:justify-start items-center pt-4 w-full mx-auto md:mx-0">
            <input
              type="email"
              name="eamil"
              placeholder="Your email address..."
              className="px-4 py-2 shadow-sm w-[200px] max-w-[200px] md:w-[500px] md:max-w-[500px] "
            />
            <input
              type="submit"
              value="Subscribe"
              className="bg-[#5BBB97] text-white px-4 py-2 shadow-sm cursor-pointer"
            />
          </form>
        </div>

        <div>
          <img
            src={newsletter}
            alt=""
            className="z-10 ml-auto hidden md:flex"
          />
        </div>
      </div>

      <img
        src={nba}
        alt=""
        className="z-0 absolute top-0 left-0 h-fit max-w-[300px]"
      />
      <img
        src={nba}
        alt=""
        className="z-0 absolute top-0 right-0 h-full bottom-0 max-w-[300px]"
      />
    </div>
  );
}
