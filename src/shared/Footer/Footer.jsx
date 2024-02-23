import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* customer  */}
        <div>
          <h3 className="font-bold text-xl mb-3">Customer</h3>
          <ul>
            <li>
              <Link>My Account</Link>
            </li>
            <li>
              <Link>Track Your Order</Link>
            </li>
            <li>
              <Link>Customer Service</Link>
            </li>
            <li>
              <Link>Team of Use</Link>
            </li>
            <li>
              <Link>Affiliate</Link>
            </li>
            <li>
              <Link>Help & Support</Link>
            </li>
          </ul>
        </div>

        {/* company  */}
        <div>
          <h3 className="font-bold text-xl mb-3">Company</h3>
          <ul>
            <li>
              <Link>About Us</Link>
            </li>
            <li>
              <Link>Search Teams</Link>
            </li>
            <li>
              <Link>Shipping Guide</Link>
            </li>
            <li>
              <Link>Site Map</Link>
            </li>
            <li>
              <Link>Carrers</Link>
            </li>
            <li>
              <Link>Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* quick link  */}
        <div>
          <h3 className="font-bold text-xl mb-3">Quick Links</h3>
          <ul>
            <li>
              <Link>Laptops & Computers</Link>
            </li>
            <li>
              <Link>Audio & Sounds</Link>
            </li>
            <li>
              <Link>Smartphone & Tablet</Link>
            </li>
            <li>
              <Link>Printers & Ink</Link>
            </li>
            <li>
              <Link>Office Suppliers</Link>
            </li>
            <li>
              <Link>Cameras & Photography</Link>
            </li>
          </ul>
        </div>

        {/* contact us  */}
        <div>
          <h3 className="font-bold text-xl mb-3">Contact Us</h3>
          <ul className="space-y-2">
            <li>
              <p>
                No.1110 Bpmofamt Street. Siote 459 NY, New York City, United
                Stated
              </p>
            </li>
            <li>
              <Link>Call: +880 12345678</Link>
            </li>
            <li>
              <Link>Email: support@gmail.com</Link>
            </li>
            <li>
              <Link>Opening: 9.00am - 9.30pm, Close Friday</Link>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-6" />

      {/* bootom footer  */}
      <div className="flex justify-between items-center">
        <p>&copy; 2024 GadgetHub. All Rights Reserved</p>
        <p>Visa</p>
      </div>
    </div>
  );
}
