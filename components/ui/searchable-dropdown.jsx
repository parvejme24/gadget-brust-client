"use client";

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';

export default function SearchableDropdown({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  label,
  className,
  disabled = false,
  emptyMessage = "No options found",
  renderOption = (option) => option.label || option.name || option,
  getValue = (option) => option.value || option.id || option._id || option,
  searchFields = ['label', 'name', 'description'],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    
    return options.filter(option => {
      return searchFields.some(field => {
        const fieldValue = option[field];
        return fieldValue && fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [options, searchTerm, searchFields]);

  const selectedOption = options.find(option => getValue(option) === value);

  const handleValueChange = (newValue) => {
    onValueChange(newValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm('');
    }
  };

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      
      <Select
        value={value}
        onValueChange={handleValueChange}
        open={isOpen}
        onOpenChange={handleOpenChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            {selectedOption ? renderOption(selectedOption) : placeholder}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10 pr-8"
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem 
                  key={getValue(option)} 
                  value={getValue(option)}
                  className="cursor-pointer"
                >
                  {renderOption(option)}
                </SelectItem>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                {emptyMessage}
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
