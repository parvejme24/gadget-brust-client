"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ReportGenerator({ reportType, onGenerate }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "monthly",
    startDate: "",
    endDate: "",
    format: "pdf",
    includeCharts: true
  });

  const formatOptions = [
    { value: "pdf", label: "PDF", icon: "📄" },
    { value: "excel", label: "Excel", icon: "📊" },
    { value: "csv", label: "CSV", icon: "📋" }
  ];

  const dateRangeOptions = [
    { value: "daily", label: "Today" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
    { value: "quarterly", label: "This Quarter" },
    { value: "yearly", label: "This Year" },
    { value: "custom", label: "Custom Range" }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(reportType, filters);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-[#38AD81]" />
          Generate {reportType} Report
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure and generate your report
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Selection */}
        <div>
          <Label htmlFor="dateRange">Report Period</Label>
          <select
            id="dateRange"
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-[#38AD81] focus:border-[#38AD81]"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div>
          <Label>Report Format</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {formatOptions.map((format) => (
              <button
                key={format.value}
                onClick={() => setFilters({...filters, format: format.value})}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  filters.format === format.value
                    ? "border-[#38AD81] bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-1">{format.icon}</div>
                <div className="text-sm font-medium">{format.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeCharts"
              checked={filters.includeCharts}
              onChange={(e) => setFilters({...filters, includeCharts: e.target.checked})}
              className="rounded border-gray-300 text-[#38AD81] focus:ring-[#38AD81]"
            />
            <Label htmlFor="includeCharts" className="text-sm">
              Include charts and graphs
            </Label>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </div>
          ) : (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </div>
          )}
        </Button>

        {/* Report Status */}
        {isGenerating && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-blue-700 text-sm">
                Generating your report... This may take a few moments.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
