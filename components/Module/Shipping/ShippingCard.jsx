"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDeleteShipping, useToggleShippingStatus } from '@/lib/hooks/useShipping';
import { 
  Truck, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Clock, 
  MapPin, 
  Weight,
  ShoppingCart,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function ShippingCard({ shipping, onEdit, onView }) {
  const deleteShippingMutation = useDeleteShipping();
  const toggleStatusMutation = useToggleShippingStatus();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${shipping.name}"?`)) {
      deleteShippingMutation.mutate(shipping._id);
    }
  };

  const handleToggleStatus = () => {
    toggleStatusMutation.mutate(shipping._id);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDays = (min, max) => {
    if (min === max) return `${min} day${min > 1 ? 's' : ''}`;
    return `${min}-${max} days`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {shipping.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={shipping.isActive ? "default" : "secondary"}
                  className={shipping.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                >
                  {shipping.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            onClick={handleToggleStatus}
            disabled={toggleStatusMutation.isPending}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            {shipping.isActive ? (
              <ToggleRight className="h-4 w-4 text-green-600" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {shipping.description && (
          <p className="text-gray-600 text-sm">{shipping.description}</p>
        )}

        {/* Shipping Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Base Charge:</span>
              <span className="font-medium">{formatCurrency(shipping.baseCharge)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Weight className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Per KG:</span>
              <span className="font-medium">{formatCurrency(shipping.perKgCharge)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Delivery:</span>
              <span className="font-medium">
                {formatDays(shipping.estimatedDays.min, shipping.estimatedDays.max)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Min Order:</span>
              <span className="font-medium">{formatCurrency(shipping.minOrderAmount)}</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Threshold */}
        {shipping.freeShippingThreshold > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">Free Shipping:</span>
              <span>Orders over {formatCurrency(shipping.freeShippingThreshold)}</span>
            </div>
          </div>
        )}

        {/* Shipping Zones */}
        {shipping.zones && shipping.zones.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4" />
              <span>Shipping Zones ({shipping.zones.length})</span>
            </div>
            <div className="space-y-1">
              {shipping.zones.slice(0, 3).map((zone, index) => (
                <div key={index} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  <span>{zone.name}</span>
                  {zone.additionalCharge > 0 && (
                    <span className="font-medium">+{formatCurrency(zone.additionalCharge)}</span>
                  )}
                </div>
              ))}
              {shipping.zones.length > 3 && (
                <p className="text-xs text-gray-500">+{shipping.zones.length - 3} more zones</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Button
            onClick={() => onView(shipping)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            onClick={() => onEdit(shipping)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteShippingMutation.isPending}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
