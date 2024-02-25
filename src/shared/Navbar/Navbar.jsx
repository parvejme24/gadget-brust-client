import { Button, Input } from "@nextui-org/react";
import React from "react";
import SearchIcon from "../icons/SearchIcon";
import LoveIcon from "../icons/LoveIcon";
import CartIcon from "../icons/CartIcon";
import { Link } from "react-router-dom";
import NavItems from "./NavItems";

export default function Navbar() {
  return (
    <div>
      <div className="container mx-auto grid grid-cols-12 items-center gap-5 py-4">
        <div className="col-span-3">
          <h2 className="font-semibold">GadgetHub</h2>
        </div>
        <div className="col-span-6">
          <Input
            type="text"
            placeholder="Search for shop..."
            labelPlacement="outside"
            className="rounded-full"
            startContent={
              <SearchIcon className="w-5 text-default-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
        <div className="col-span-3 flex justify-end items-center gap-4">
          <span className="border p-1 border-black">
            <LoveIcon />
          </span>
          <span className="border p-1 border-black">
            <CartIcon />
          </span>
          
        </div>
      </div>

      <NavItems />
    </div>
  );
}
