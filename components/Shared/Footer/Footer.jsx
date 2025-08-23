import React from "react";
import logo from "@/assets/logo.svg";
import paymentSystem from "@/assets/payment-system.svg";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { FiMapPin, FiPhoneCall } from "react-icons/fi";

// reusable section heading component
const SectionHeading = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-800 border-b-2 border-[#38AD81] pb-2 inline-block ${className}`}>
    {children}
  </h3>
);

// reusable social media links component
const SocialMediaLinks = ({ className = "", showLabels = true }) => {
  const socialLinks = [
    { name: "Facebook", href: "/facebook", icon: FaFacebookF, color: "hover:bg-blue-600" },
    { name: "YouTube", href: "/youtube", icon: FaYoutube, color: "hover:bg-red-600" },
    { name: "Instagram", href: "/instagram", icon: FaInstagram, color: "hover:bg-pink-600" }
  ];

  return (
    <div className={className}>
      {showLabels && (
        <p className="text-sm font-medium text-gray-700 mb-3">
          Follow us on social media
        </p>
      )}
      <ul className="flex gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <li key={social.name}>
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-[#38AD81] text-gray-600 hover:text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${social.color}`}
                aria-label={social.name}
              >
                <Icon size={16} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// reusable navigation links component
const NavigationLinks = ({ links = [], className = "" }) => (
  <ul className={`space-y-3 ${className}`}>
    {links.map((link, index) => (
      <li key={index}>
        <Link
          href={link.href}
          className="text-gray-600 hover:text-[#38AD81] hover:underline transition-colors duration-300 text-sm block py-1"
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
);

// reusable contact info component
const ContactInfo = ({ className = "" }) => (
  <ul className={`space-y-4 ${className}`}>
    <li className="flex items-start gap-3">
      <FiMapPin
        className="text-[#38AD81] mt-1 flex-shrink-0"
        size={16}
      />
      <span className="text-gray-600 text-sm leading-relaxed">
        11/A, Bonifant Street, Suite 459 NY, New York City, United
        States
      </span>
    </li>
    <li className="flex items-center gap-3">
      <FiPhoneCall
        className="text-[#38AD81] flex-shrink-0"
        size={16}
      />
      <Link
        href="tel:01234567890"
        className="text-gray-600 hover:text-[#38AD81] transition-colors duration-300 text-sm"
      >
        +1 (012) 345-6789
      </Link>
    </li>
    <li className="flex items-center gap-3">
      <FaRegEnvelope
        className="text-[#38AD81] flex-shrink-0"
        size={16}
      />
      <Link
        href="mailto:info@gadgetbrust.com"
        className="text-gray-600 hover:text-[#38AD81] transition-colors duration-300 text-sm"
      >
        info@gadgetbrust.com
      </Link>
    </li>
  </ul>
);

export default function Footer() {
  // data for navigation links
  const customerServiceLinks = [
    { href: "/track-order", label: "Track Your Order" },
    { href: "/customer-service", label: "Customer Service" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/affiliate", label: "Affiliate Program" },
    { href: "/help-support", label: "Help & Support" }
  ];

  const productLinks = [
    { href: "/laptops-computers", label: "Laptops & Computers" },
    { href: "/audio-video", label: "Audio & Video" },
    { href: "/smartphones-tablets", label: "Smartphones & Tablets" },
    { href: "/office-supplies", label: "Office Supplies" },
    { href: "/cameras", label: "Cameras" }
  ];

  return (
    <footer className="text-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* company info section - spans 2 columns on medium screens */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Image
                  src={logo}
                  alt="Gadget Brust Logo"
                  className="h-14 w-auto"
                />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Your one-stop destination for amazing gadgets and cutting-edge
                technology. Quality products, exceptional service.
              </p>
            </div>

            {/* social media links */}
            <SocialMediaLinks />
          </div>

          {/* customer service section */}
          <div className="space-y-4">
            <SectionHeading>Customer Service</SectionHeading>
            <NavigationLinks links={customerServiceLinks} />
          </div>

          {/* products section */}
          <div className="space-y-4">
            <SectionHeading>Our Products</SectionHeading>
            <NavigationLinks links={productLinks} />
          </div>

          {/* contact information section */}
          <div className="space-y-4">
            <SectionHeading>Contact Us</SectionHeading>
            <ContactInfo />
          </div>
        </div>

        {/* bottom footer */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Gadget Brust. All rights reserved.
            </p>
            <div className="flex items-center">
              <Image
                src={paymentSystem}
                alt="Payment methods accepted"
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
