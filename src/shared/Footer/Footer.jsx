import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import MapPin from "../icons/MapPin";
import PhoneIcon from "../icons/PhoneIcon";
import EnvelopeIcon from "../icons/EnvelopeIcon";

export default function Footer() {
  return (
    <div className="container mx-auto">
      <div className="mx-4 lg:mx-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10">
        {/* logo & social icon section  */}
        <div className="space-y-4 col-span-2">
          <h2>GadgetHub</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem
            architecto reiciendis voluptas provident tempore eveniet quam dicta
            voluptate voluptatibus laboriosam.
          </p>
          <ul className="flex gap-3 items-center text-2xl">
            <li>
              <a href="">
                <FaFacebook />
              </a>
            </li>
            <li>
              <a href="">
                <FaInstagram />
              </a>
            </li>
            <li>
              <a href="">
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>

        {/* customer section  */}
        <div className="space-y-4">
          <h4 className="font-bold">Customer</h4>
          <hr className="" />

          <ul className="text-gray-500 space-y-2">
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="">Track Your Order</a>
            </li>
            <li>
              <a href="">Customer Service</a>
            </li>
            <li>
              <a href="">Term Of Use</a>
            </li>
            <li>
              <a href="">Affiliate</a>
            </li>
            <li>
              <a href="">Help & Support</a>
            </li>
          </ul>
        </div>

        {/* company section  */}
        <div className="space-y-4">
          <h4 className="font-bold">Customer</h4>
          <hr className="" />

          <ul className="text-gray-500 space-y-2">
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="">Track Your Order</a>
            </li>
            <li>
              <a href="">Customer Service</a>
            </li>
            <li>
              <a href="">Term Of Use</a>
            </li>
            <li>
              <a href="">Affiliate</a>
            </li>
            <li>
              <a href="">Help & Support</a>
            </li>
          </ul>
        </div>

        {/* quick links section  */}
        <div className="space-y-4">
          <h4 className="font-bold">Customer</h4>
          <hr className="" />

          <ul className="text-gray-500 space-y-2">
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="">Track Your Order</a>
            </li>
            <li>
              <a href="">Customer Service</a>
            </li>
            <li>
              <a href="">Term Of Use</a>
            </li>
            <li>
              <a href="">Affiliate</a>
            </li>
            <li>
              <a href="">Help & Support</a>
            </li>
          </ul>
        </div>

        {/* contact us section  */}
        <div className="space-y-4 col-span-2">
          <h4 className="font-bold">Contact Us</h4>
          <hr className="" />

          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <MapPin />
              <p>
                11/A, Bonifant Street, Suite 459 NY, New York City, United
                Stated
              </p>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon />
              <p>01234567890 </p>
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon />
              <p>logotech@xyz.com</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
