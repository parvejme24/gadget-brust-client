"use client"
import React, { useState } from 'react';
import { MdStore, MdSettings, MdSave, MdEdit, MdBusiness, MdEmail, MdPhone, MdLocationOn, MdPayment, MdLocalShipping, MdSecurity } from 'react-icons/md';
import { FaGlobe, FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';

export default function StoreSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const storeInfo = {
    name: 'Gadget Shop',
    email: 'info@gadgetshop.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    website: 'www.gadgetshop.com',
    description: 'Your one-stop destination for premium gadgets and electronics',
    currency: 'USD',
    timezone: 'America/Los_Angeles'
  };

  const paymentSettings = {
    stripe: { enabled: true, key: 'pk_test_...' },
    paypal: { enabled: true, clientId: 'client_id_...' },
    applePay: { enabled: true },
    bankTransfer: { enabled: false }
  };

  const shippingSettings = {
    freeShippingThreshold: 50,
    flatRate: 5.99,
    expressShipping: 15.99,
    internationalShipping: 25.99
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <MdBusiness className="w-5 h-5" /> },
    { id: 'payment', name: 'Payment', icon: <MdPayment className="w-5 h-5" /> },
    { id: 'shipping', name: 'Shipping', icon: <MdLocalShipping className="w-5 h-5" /> },
    { id: 'security', name: 'Security', icon: <MdSecurity className="w-5 h-5" /> }
  ];

  const handleSave = () => {
    console.log('Saving settings...');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-600">Configure your gadget shop settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <MdSave />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <MdEdit />
              <span>Edit Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* general settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={storeInfo.name}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={storeInfo.email}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={storeInfo.phone}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={storeInfo.website}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={storeInfo.address}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={storeInfo.currency}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={storeInfo.timezone}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                  <textarea
                    value={storeInfo.description}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* payment settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaCreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Stripe</div>
                      <div className="text-sm text-gray-600">Credit card processing</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paymentSettings.stripe.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {paymentSettings.stripe.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-900">Configure</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaPaypal className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">PayPal</div>
                      <div className="text-sm text-gray-600">Digital wallet payments</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paymentSettings.paypal.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {paymentSettings.paypal.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-900">Configure</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaApplePay className="w-6 h-6 text-black" />
                    <div>
                      <div className="font-medium text-gray-900">Apple Pay</div>
                      <div className="text-sm text-gray-600">Mobile payments</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      paymentSettings.applePay.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {paymentSettings.applePay.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-900">Configure</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* shipping settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Shipping Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flat Rate Shipping ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingSettings.flatRate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Express Shipping ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingSettings.expressShipping}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">International Shipping ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingSettings.internationalShipping}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* security settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MdSecurity className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Two-Factor Authentication</div>
                      <div className="text-sm text-blue-700">Enhance your account security</div>
                    </div>
                  </div>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Enable 2FA
                  </button>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MdSecurity className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">SSL Certificate</div>
                      <div className="text-sm text-green-700">Your store is secured with SSL encryption</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MdSecurity className="w-6 h-6 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-900">Password Policy</div>
                      <div className="text-sm text-yellow-700">Strong passwords are required for all accounts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

