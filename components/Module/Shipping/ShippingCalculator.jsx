"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableDropdown from '@/components/ui/searchable-dropdown';
import { useCalculateShippingCharge, useAllShipping } from '@/lib/hooks/useShipping';
import { Calculator, DollarSign, Weight, Package, Loader2 } from 'lucide-react';

export default function ShippingCalculator() {
  const [calculationData, setCalculationData] = useState({
    orderAmount: 0,
    totalWeight: 0,
    shippingMethodId: '',
  });

  const [result, setResult] = useState(null);

  const calculateMutation = useCalculateShippingCharge();
  const { data: shippingData } = useAllShipping();
  const shippingMethods = shippingData?.data || [];

  const handleInputChange = (field, value) => {
    setCalculationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    if (!calculationData.shippingMethodId) {
      alert('Please select a shipping method');
      return;
    }

    try {
      const response = await calculateMutation.mutateAsync(calculationData);
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating shipping:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const selectedMethod = shippingMethods.find(method => method._id === calculationData.shippingMethodId);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Shipping Calculator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderAmount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Order Amount ($)
              </Label>
              <Input
                id="orderAmount"
                type="number"
                min="0"
                step="0.01"
                value={calculationData.orderAmount}
                onChange={(e) => handleInputChange('orderAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalWeight" className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                Total Weight (kg)
              </Label>
              <Input
                id="totalWeight"
                type="number"
                min="0"
                step="0.1"
                value={calculationData.totalWeight}
                onChange={(e) => handleInputChange('totalWeight', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>
          </div>

          <SearchableDropdown
            label="Shipping Method"
            options={shippingMethods.filter(method => method.isActive)}
            value={calculationData.shippingMethodId}
            onValueChange={(value) => handleInputChange('shippingMethodId', value)}
            placeholder="Select a shipping method"
            searchPlaceholder="Search shipping methods..."
            emptyMessage="No active shipping methods found"
            renderOption={(method) => (
              <div className="flex flex-col">
                <span className="font-medium">{method.name}</span>
                <span className="text-sm text-gray-500">
                  {formatCurrency(method.baseCharge)} base + {formatCurrency(method.perKgCharge)}/kg
                </span>
              </div>
            )}
            searchFields={['name', 'description']}
          />
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={calculateMutation.isPending || !calculationData.shippingMethodId}
          className="w-full bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {calculateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Calculator className="h-4 w-4 mr-2" />
          )}
          Calculate Shipping Cost
        </Button>

        {/* Selected Method Details */}
        {selectedMethod && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Selected Method Details</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Base Charge:</span>
                <span>{formatCurrency(selectedMethod.baseCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span>Per KG Charge:</span>
                <span>{formatCurrency(selectedMethod.perKgCharge)}</span>
              </div>
              {selectedMethod.freeShippingThreshold > 0 && (
                <div className="flex justify-between">
                  <span>Free Shipping Threshold:</span>
                  <span>{formatCurrency(selectedMethod.freeShippingThreshold)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span>{selectedMethod.estimatedDays.min}-{selectedMethod.estimatedDays.max} days</span>
              </div>
            </div>
          </div>
        )}

        {/* Calculation Result */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Shipping Calculation Result</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-800">Shipping Cost:</span>
                <span className="text-2xl font-bold text-green-900">
                  {formatCurrency(result.shippingCharge)}
                </span>
              </div>
              
              {result.isFreeShipping && (
                <div className="text-center">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    🎉 Free Shipping Applied!
                  </span>
                </div>
              )}
              
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex justify-between">
                  <span>Order Amount:</span>
                  <span>{formatCurrency(result.orderAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Weight:</span>
                  <span>{result.totalWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Charge:</span>
                  <span>{formatCurrency(result.baseCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight Charge:</span>
                  <span>{formatCurrency(result.weightCharge)}</span>
                </div>
                {result.freeShippingThreshold > 0 && (
                  <div className="flex justify-between">
                    <span>Free Shipping Threshold:</span>
                    <span>{formatCurrency(result.freeShippingThreshold)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {calculateMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Calculation Error</h4>
            <p className="text-sm text-red-800">
              {calculateMutation.error.response?.data?.message || 'Failed to calculate shipping cost'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
