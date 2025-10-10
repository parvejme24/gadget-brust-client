"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="border-b border-gray-200">
      <div className="w-full h-80 rounded-xl overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d19868.373358018045!2d-0.11951900000000001!3d51.503186!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604d6521cf76f%3A0x59786c2a753ead99!2sGinza%20St.%20James&#39;s%20-%20Japanese%20Restaurant!5e0!3m2!1sen!2sus!4v1755801895329!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Location"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Contact Information */}
          <div className="space-y-8">
            {/* Get in Touch Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're here to help and answer any questions you might have. We
                look forward to hearing from you.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#4AB58D] to-[#38AD81] p-3 rounded-xl text-white">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Head Office
                    </h3>
                    <p className="text-gray-600 text-sm">
                      123 Main St, Anytown, USA
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#4AB58D] to-[#38AD81] p-3 rounded-xl text-white">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Email Address
                    </h3>
                    <a
                      href="mailto:info@gadgetbrust.com"
                      className="text-[#4AB58D] hover:text-[#38AD81] transition-colors text-sm font-medium"
                    >
                      info@gadgetbrust.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#4AB58D] to-[#38AD81] p-3 rounded-xl text-white">
                    <FaPhone className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Phone Number
                    </h3>
                    <a
                      href="tel:+8801234567890"
                      className="text-[#4AB58D] hover:text-[#38AD81] transition-colors text-sm font-medium"
                    >
                      +880 123 456 7890
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Follow Buttons */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Follow Us
                </h3>
                <p className="text-gray-600 mb-4">
                  Stay connected with us on social media for the latest updates
                  and news.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="#"
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center w-12 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-xl" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="text-xl" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Contact Form
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name">Name</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="h-12 text-base"
                />
              </div>
              <div>
                <label htmlFor="name">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="h-12 text-base"
                />
              </div>
              <div>
                <label htmlFor="name">Phone</label>
                <Input
                  type="number"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone"
                  className="h-12 text-base"
                />
              </div>
              <div>
                <label htmlFor="name">Company Name</label>
                <Input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Enter your company name"
                  className="h-12 text-base"
                />
              </div>
              <div>
                <label htmlFor="name">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  className="h-32 text-base resize-none"
                />
              </div>

              <Button
                variant="ghost"
                className="w-full bg-[#38AD81] hover:bg-[#38AD81]/80 text-white cursor-pointer h-12 text-base"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
