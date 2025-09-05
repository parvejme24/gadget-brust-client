"use client"
import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCategory, MdInventory, MdTrendingUp } from 'react-icons/md';

export default function Categories() {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '📱' });

  const categories = [
    {
      id: 1,
      name: 'Smartphones',
      description: 'Mobile phones and smartphones',
      icon: '📱',
      productCount: 24,
      totalSales: 156,
      revenue: '$28,450'
    },
    {
      id: 2,
      name: 'Laptops',
      description: 'Portable computers and notebooks',
      icon: '💻',
      productCount: 18,
      totalSales: 89,
      revenue: '$45,230'
    },
    {
      id: 3,
      name: 'Audio',
      description: 'Headphones, speakers, and audio devices',
      icon: '🎧',
      productCount: 32,
      totalSales: 445,
      revenue: '$12,890'
    },
    {
      id: 4,
      name: 'Tablets',
      description: 'Tablet computers and iPads',
      icon: '📱',
      productCount: 15,
      totalSales: 78,
      revenue: '$18,750'
    },
    {
      id: 5,
      name: 'Wearables',
      description: 'Smartwatches and fitness trackers',
      icon: '⌚',
      productCount: 28,
      totalSales: 123,
      revenue: '$8,950'
    },
    {
      id: 6,
      name: 'Accessories',
      description: 'Phone cases, chargers, and cables',
      icon: '🔌',
      productCount: 45,
      totalSales: 234,
      revenue: '$5,670'
    }
  ];

  const icons = ['📱', '💻', '🎧', '📱', '⌚', '🔌', '📷', '🎮', '🏠', '🚗'];

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      // here you would typically add to your database
      console.log('Adding category:', newCategory);
      setNewCategory({ name: '', description: '', icon: '📱' });
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <button 
          onClick={() => setIsAddingCategory(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <MdAdd />
          <span>Add Category</span>
        </button>
      </div>

      {/* add category modal */}
      {isAddingCategory && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <select
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {icons.map((icon, index) => (
                  <option key={index} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAddingCategory(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>
        </div>
      )}

      {/* categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{category.icon}</div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <MdEdit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1">
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Products:</span>
                <span className="font-medium text-gray-900">{category.productCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Sales:</span>
                <span className="font-medium text-gray-900">{category.totalSales}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Revenue:</span>
                <span className="font-medium text-green-600">{category.revenue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* category stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Total Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {categories.reduce((sum, cat) => sum + cat.totalSales, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${categories.reduce((sum, cat) => sum + parseInt(cat.revenue.replace(/[$,]/g, '')), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}

