"use client";

import React, { useState } from "react";
import { useDeleteCategory } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, X, AlertTriangle, Shield, Trash2 } from "lucide-react";
import { FaRegTrashCan } from "react-icons/fa6";

export default function DeleteCategory({ isOpen, onClose, category }) {
  const deleteCategoryMutation = useDeleteCategory();
  const [isConfirming, setIsConfirming] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleDelete = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      setShowWarning(true);
      return;
    }

    try {
      await deleteCategoryMutation.mutateAsync(category._id);
      toast.success("Category deleted successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setIsConfirming(false);
      setShowWarning(false);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setShowWarning(false);
    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50">
                {isConfirming ? (
                  <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
                ) : (
                  <Trash2 className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isConfirming ? 'Final Confirmation' : 'Delete Category'}
                </h2>
                <p className="text-red-500 text-sm">
                  {isConfirming ? 'This action is irreversible' : 'Permanent action required'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel} 
              className="cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Category Info */}
            <div className={`transition-all duration-300 ${showWarning ? 'animate-pulse' : ''}`}>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                {category.categoryImg?.url && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img 
                      src={category.categoryImg.url} 
                      alt={category.categoryName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{category.categoryName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <p className="text-sm text-blue-600 font-medium">
                        {category.subcategories.length} subcategories will be deleted
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className={`transition-all duration-300 ${showWarning ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Critical Warning</h4>
                    <p className="text-red-700 text-sm leading-relaxed">
                      This action will permanently delete the category and all its subcategories. 
                      This cannot be undone and may affect related products or data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Confirmation Message */}
            <div className="text-center">
              <p className="text-gray-600 text-sm leading-relaxed">
                {isConfirming 
                  ? "Are you absolutely sure you want to proceed with deletion?" 
                  : "This action cannot be undone. Click delete to confirm."
                }
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={deleteCategoryMutation.isPending}
                className="cursor-pointer w-full sm:w-auto h-11 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteCategoryMutation.isPending}
                className={`cursor-pointer w-full sm:w-auto h-11 transition-all duration-200 ${
                  isConfirming 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {deleteCategoryMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaRegTrashCan className="h-4 w-4 mr-2" />
                    {isConfirming ? 'Confirm Delete' : 'Delete Category'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
