"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useStoreSettings,
  useResetStoreSettings,
} from "@/lib/hooks/useStoreSettings";
import GeneralSettings from "@/components/Module/StoreSettings/GeneralSettings";
import ContactSettings from "@/components/Module/StoreSettings/ContactSettings";
import SocialSettings from "@/components/Module/StoreSettings/SocialSettings";
import SEOSettings from "@/components/Module/StoreSettings/SEOSettings";
import CurrencySettings from "@/components/Module/StoreSettings/CurrencySettings";
import {
  Loader2,
  Settings,
  RotateCcw,
  Save,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showResetDialog, setShowResetDialog] = useState(false);

  const { data: settings, isLoading, error } = useStoreSettings();
  const resetMutation = useResetStoreSettings();

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: <Settings className="h-4 w-4" />,
      component: GeneralSettings,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Settings className="h-4 w-4" />,
      component: ContactSettings,
    },
    {
      id: "social",
      label: "Social Media",
      icon: <Settings className="h-4 w-4" />,
      component: SocialSettings,
    },
    {
      id: "seo",
      label: "SEO",
      icon: <Settings className="h-4 w-4" />,
      component: SEOSettings,
    },
    {
      id: "currency",
      label: "Currency & Localization",
      icon: <Settings className="h-4 w-4" />,
      component: CurrencySettings,
    },
  ];

  const handleResetSettings = async () => {
    try {
      await resetMutation.mutateAsync();
      setShowResetDialog(false);
    } catch (error) {
      console.error("Error resetting settings:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading store settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load store settings</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "bg-[#38AD81] text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tabs.find((tab) => tab.id === activeTab)?.icon}
                  {tabs.find((tab) => tab.id === activeTab)?.label} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ActiveComponent && (
                  <ActiveComponent settings={settings} isLoading={isLoading} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Reset Store Settings
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all store settings to their default
              values? This action cannot be undone and will affect all aspects
              of your store configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetSettings}
              disabled={resetMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {resetMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
