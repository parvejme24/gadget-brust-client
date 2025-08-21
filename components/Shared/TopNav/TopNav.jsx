"use client";
import React, { useState, useEffect } from "react";
import { FaClock, FaGlobe, FaDollarSign, FaChevronDown } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // language and currency change handlers
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.name);

    // change entire site language
    document.documentElement.lang = language.code;

    // store in localStorage for persistence
    localStorage.setItem("selectedLanguage", JSON.stringify(language));

    // you can add more language-specific changes here
    // such as updating text content, date formats, etc.
    console.log(`Language changed to: ${language.name} (${language.code})`);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency.code);

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
      setSelectedLanguage(language.name);
      document.documentElement.lang = language.code;
    }

    if (savedCurrency) {
      const currency = JSON.parse(savedCurrency);
      setSelectedCurrency(currency.code);
    }
  }, []);

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

  return (
    <div className="bg-[#F7F8FA] py-2">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* left side - opening hours */}
          <div className="flex items-center gap-2 text-sm text-gray-600"></div>

          {/* right side - language and currency dropdowns */}
          <div className="flex items-center gap-4">
            {/* language changing dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  <FaGlobe className="mr-2 text-[#38AD81]" />
                  <span>{selectedLanguage}</span>
                  <FaChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className="flex items-center gap-3 cursor-pointer"
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
                  className="h-8 px-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  <FaDollarSign className="mr-2 text-[#38AD81]" />
                  <span>{selectedCurrency}</span>
                  <FaChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="font-medium text-[#38AD81]">
                      {currency.symbol}
                    </span>
                    <span>{currency.name}</span>
                    <span className="ml-auto text-xs text-gray-500">
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
