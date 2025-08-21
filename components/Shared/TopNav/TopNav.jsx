"use client";
import React, { useState, useEffect } from "react";
import { FaGlobe, FaDollarSign } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TopNav() {
  // define arrays first before using them in useState
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  // language and currency change handlers
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    // change entire site language
    document.documentElement.lang = language.code;

    // store in localStorage for persistence
    localStorage.setItem("selectedLanguage", JSON.stringify(language));

    // you can add more language-specific changes here
    // such as updating text content, date formats, etc.
    console.log(`Language changed to: ${language.name} (${language.code})`);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);

    // store in localStorage for persistence
    localStorage.setItem("selectedCurrency", JSON.stringify(currency));

    // you can add more currency-specific changes here
    // such as updating prices, number formats, etc.
    console.log(`Currency changed to: ${currency.name} (${currency.code})`);
  };

  // load saved preferences on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    const savedCurrency = localStorage.getItem("selectedCurrency");

    if (savedLanguage) {
      const language = JSON.parse(savedLanguage);
      setSelectedLanguage(language);
      document.documentElement.lang = language.code;
    }

    if (savedCurrency) {
      const currency = JSON.parse(savedCurrency);
      setSelectedCurrency(currency);
    }
  }, []);

  return (
    <div className="bg-[#F7F8FA] border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* left - auth links */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Link
              href="/login"
              className="hover:text-[#38AD81] transition-colors duration-200"
            >
              Login
            </Link>
            /
            <Link
              href="/register"
              className="hover:text-[#38AD81] transition-colors duration-200"
            >
              Register
            </Link>
          </div>

          {/* right side - language and currency dropdowns */}
          <div className="flex items-center gap-0 text-xs">
            {/* language changing dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-r border-gray-300 pr-2 sm:pr-3 rounded-r-none"
                >
                  {/* show icon on medium+ devices, show language code on small devices */}
                  <FaGlobe className="hidden sm:block text-[#38AD81] text-xs sm:text-sm" />
                  <span className="sm:hidden text-[#38AD81] font-medium">{selectedLanguage.code.toUpperCase()}</span>
                  
                  <span className="hidden sm:inline ml-1 sm:ml-2">{selectedLanguage.name}</span>
                  <RiArrowDropDownLine className="ml-1 sm:ml-2 text-lg" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 sm:w-48">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className="flex items-center gap-3 cursor-pointer text-xs"
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* currency changing dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-none"
                >
                  {/* show icon on medium+ devices, show currency code on small devices */}
                  <FaDollarSign className="hidden sm:block text-[#38AD81] text-xs sm:text-sm" />
                  <span className="sm:hidden text-[#38AD81] font-medium">{selectedCurrency.code}</span>
                  
                  <span className="hidden sm:inline ml-1 sm:ml-2">{selectedCurrency.name}</span>
                  <RiArrowDropDownLine className="ml-1 sm:ml-2 text-lg" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 sm:w-48">
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className="flex items-center gap-3 cursor-pointer text-xs"
                  >
                    <span className="font-medium text-[#38AD81]">
                      {currency.symbol}
                    </span>
                    <span className="hidden sm:inline">{currency.name}</span>
                    <span className="sm:hidden">{currency.code}</span>
                    <span className="ml-auto text-xs text-gray-500 hidden sm:inline">
                      ({currency.code})
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
