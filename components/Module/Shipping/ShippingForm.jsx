"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateShipping, useUpdateShipping } from '@/lib/hooks/useShipping';
import { Loader2, Plus, X, Truck } from 'lucide-react';

export default function ShippingForm({ shipping, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseCharge: 0,
    perKgCharge: 0,
    minOrderAmount: 0,
    freeShippingThreshold: 0,
    estimatedDays: {
      min: 3,
      max: 7,
    },
    isActive: true,
    zones: [],
  });

  const [newZone, setNewZone] = useState({
    name: '',
    countries: '',
    additionalCharge: 0,
  });

  const createShippingMutation = useCreateShipping();
  const updateShippingMutation = useUpdateShipping();

  useEffect(() => {
    if (shipping) {
      setFormData({
        name: shipping.name || '',
        description: shipping.description || '',
        baseCharge: shipping.baseCharge || 0,
        perKgCharge: shipping.perKgCharge || 0,
        minOrderAmount: shipping.minOrderAmount || 0,
        freeShippingThreshold: shipping.freeShippingThreshold || 0,
        estimatedDays: {
          min: shipping.estimatedDays?.min || 3,
          max: shipping.estimatedDays?.max || 7,
        },
        isActive: shipping.isActive !== undefined ? shipping.isActive : true,
        zones: shipping.zones || [],
      });
    }
  }, [shipping]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddZone = () => {
    if (newZone.name.trim()) {
      const countries = newZone.countries
        .split(',')
        .map(country => country.trim())
        .filter(country => country);
      
      setFormData(prev => ({
        ...prev,
        zones: [...prev.zones, {
          name: newZone.name.trim(),
          countries,
          additionalCharge: newZone.additionalCharge,
        }]
      }));
      
      setNewZone({ name: '', countries: '', additionalCharge: 0 });
    }
  };

  const handleRemoveZone = (index) => {
    setFormData(prev => ({
      ...prev,
      zones: prev.zones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (shipping) {
        await updateShippingMutation.mutateAsync({
          id: shipping._id,
          data: formData
        });
      } else {
        await createShippingMutation.mutateAsync(formData);
      }
      
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error saving shipping method:', error);
    }
  };

  const isLoading = createShippingMutation.isPending || updateShippingMutation.isPending;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {shipping ? 'Edit Shipping Method' : 'Add New Shipping Method'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shipping Method Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Standard Shipping, Express Delivery"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this shipping method"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of this shipping method"
                rows={3}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseCharge">Base Charge ($) *</Label>
                <Input
                  id="baseCharge"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.baseCharge}
                  onChange={(e) => handleInputChange('baseCharge', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="perKgCharge">Per KG Charge ($) *</Label>
                <Input
                  id="perKgCharge"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.perKgCharge}
                  onChange={(e) => handleInputChange('perKgCharge', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) => handleInputChange('minOrderAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedDaysMin">Minimum Days *</Label>
                <Input
                  id="estimatedDaysMin"
                  type="number"
                  min="1"
                  value={formData.estimatedDays.min}
                  onChange={(e) => handleInputChange('estimatedDays.min', parseInt(e.target.value) || 1)}
                  placeholder="3"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedDaysMax">Maximum Days *</Label>
                <Input
                  id="estimatedDaysMax"
                  type="number"
                  min="1"
                  value={formData.estimatedDays.max}
                  onChange={(e) => handleInputChange('estimatedDays.max', parseInt(e.target.value) || 1)}
                  placeholder="7"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Zones</h3>
            
            {/* Add New Zone */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-700">Add New Zone</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zoneName">Zone Name</Label>
                  <Input
                    id="zoneName"
                    value={newZone.name}
                    onChange={(e) => setNewZone(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., North America, Europe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zoneCountries">Countries (comma-separated)</Label>
                  <Input
                    id="zoneCountries"
                    value={newZone.countries}
                    onChange={(e) => setNewZone(prev => ({ ...prev, countries: e.target.value }))}
                    placeholder="US, CA, MX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zoneCharge">Additional Charge ($)</Label>
                  <Input
                    id="zoneCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newZone.additionalCharge}
                    onChange={(e) => setNewZone(prev => ({ ...prev, additionalCharge: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleAddZone}
                disabled={!newZone.name.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Zone
              </Button>
            </div>

            {/* Existing Zones */}
            {formData.zones.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Current Zones</h4>
                {formData.zones.map((zone, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">{zone.name}</span>
                      {zone.countries.length > 0 && (
                        <span className="text-sm text-gray-600 ml-2">
                          ({zone.countries.join(', ')})
                        </span>
                      )}
                      {zone.additionalCharge > 0 && (
                        <span className="text-sm text-green-600 ml-2">
                          +${zone.additionalCharge}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveZone(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-sm text-gray-600">
                  Enable or disable this shipping method
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {shipping ? 'Update Shipping Method' : 'Create Shipping Method'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
