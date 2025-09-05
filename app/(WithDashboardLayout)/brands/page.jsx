"use client"
import React, { useState } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch, 
  MdFilterList, 
  MdBrandingWatermark,
  MdInventory,
  MdTrendingUp,
  MdStar,
  MdBusiness,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWeb,
  MdDescription
} from 'react-icons/md';
import { FaEye, FaGlobe, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    image: ''
  });
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    logo: ''
  });

  const brands = [
    {
      id: 1,
      name: 'Apple',
      description: 'Premium technology and innovation leader',
      logo: '🍎',
      website: 'https://apple.com',
      email: 'contact@apple.com',
      phone: '+1-800-275-2273',
      address: 'Cupertino, CA, USA',
      productsCount: 45,
      totalSales: '$2.4M',
      rating: 4.8,
      status: 'active',
      socialMedia: {
        instagram: '@apple',
        facebook: 'apple',
        twitter: '@Apple'
      }
    },
    {
      id: 2,
      name: 'Samsung',
      description: 'Global electronics and mobile technology',
      logo: '📱',
      website: 'https://samsung.com',
      email: 'info@samsung.com',
      phone: '+82-2-2255-0114',
      address: 'Seoul, South Korea',
      productsCount: 38,
      totalSales: '$1.8M',
      rating: 4.6,
      status: 'active',
      socialMedia: {
        instagram: '@samsung',
        facebook: 'samsung',
        twitter: '@Samsung'
      }
    },
    {
      id: 3,
      name: 'Sony',
      description: 'Entertainment and technology solutions',
      logo: '🎮',
      website: 'https://sony.com',
      email: 'support@sony.com',
      phone: '+81-3-6748-2111',
      address: 'Tokyo, Japan',
      productsCount: 32,
      totalSales: '$1.2M',
      rating: 4.5,
      status: 'active',
      socialMedia: {
        instagram: '@sony',
        facebook: 'sony',
        twitter: '@Sony'
      }
    },
    {
      id: 4,
      name: 'LG',
      description: 'Home appliances and electronics',
      logo: '📺',
      website: 'https://lg.com',
      email: 'service@lg.com',
      phone: '+82-2-3773-1114',
      address: 'Seoul, South Korea',
      productsCount: 28,
      totalSales: '$980K',
      rating: 4.4,
      status: 'active',
      socialMedia: {
        instagram: '@lg',
        facebook: 'lg',
        twitter: '@LG'
      }
    },
    {
      id: 5,
      name: 'Xiaomi',
      description: 'Affordable smartphones and smart devices',
      logo: '📱',
      website: 'https://mi.com',
      email: 'service@mi.com',
      phone: '+86-400-100-5678',
      address: 'Beijing, China',
      productsCount: 25,
      totalSales: '$750K',
      rating: 4.3,
      status: 'active',
      socialMedia: {
        instagram: '@xiaomi',
        facebook: 'xiaomi',
        twitter: '@Xiaomi'
      }
    }
  ];

  const categories = ['all', 'smartphones', 'laptops', 'tablets', 'accessories', 'smart home'];

  const handleAddProduct = (e) => {
    e.preventDefault();
    // here you would typically send the data to your backend
    console.log('Adding new product:', newProduct);
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      price: '',
      description: '',
      image: ''
    });
    setIsAddProductModalOpen(false);
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    // here you would typically send the data to your backend
    console.log('Adding new brand:', newBrand);
    setNewBrand({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      logo: ''
    });
    setIsAddBrandModalOpen(false);
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || brand.productsCount > 0;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your product brands and partnerships</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setIsAddBrandModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Add Brand
          </button>
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* brands overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MdBrandingWatermark className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Brands</dt>
                  <dd className="text-lg font-medium text-gray-900">{brands.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MdInventory className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {brands.reduce((sum, brand) => sum + brand.productsCount, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MdTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${(brands.reduce((sum, brand) => sum + parseFloat(brand.totalSales.replace(/[^0-9.]/g, '')), 0) / 1000).toFixed(1)}M
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MdStar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(brands.reduce((sum, brand) => sum + brand.rating, 0) / brands.length).toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* brands grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {/* brand header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{brand.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                    <div className="flex items-center space-x-1">
                      <MdStar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{brand.rating}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  brand.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {brand.status}
                </span>
              </div>

              {/* brand description */}
              <p className="text-sm text-gray-600 mb-4">{brand.description}</p>

              {/* brand stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{brand.productsCount}</div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{brand.totalSales}</div>
                  <div className="text-xs text-gray-500">Sales</div>
                </div>
              </div>

              {/* brand contact info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MdEmail className="mr-2 h-4 w-4" />
                  <span className="truncate">{brand.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MdPhone className="mr-2 h-4 w-4" />
                  <span>{brand.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MdLocationOn className="mr-2 h-4 w-4" />
                  <span className="truncate">{brand.address}</span>
                </div>
              </div>

              {/* social media */}
              <div className="flex items-center space-x-3 mb-4">
                <a href={`https://instagram.com/${brand.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                  <FaInstagram className="h-4 w-4" />
                </a>
                <a href={`https://facebook.com/${brand.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  <FaFacebook className="h-4 w-4" />
                </a>
                <a href={`https://twitter.com/${brand.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                  <FaGlobe className="h-4 w-4" />
                </a>
              </div>

              {/* actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Products
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                    <MdEdit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100">
                    <MdDelete className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* add product modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddProductModalOpen(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddProduct}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <MdAdd className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Product</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Product Name</label>
                          <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Brand</label>
                          <select
                            required
                            value={newProduct.brand}
                            onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Brand</option>
                            {brands.map(brand => (
                              <option key={brand.id} value={brand.name}>{brand.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <select
                            required
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Category</option>
                            {categories.filter(cat => cat !== 'all').map(category => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            rows="3"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Image URL</label>
                          <input
                            type="url"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* add brand modal */}
      {isAddBrandModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddBrandModalOpen(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddBrand}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <MdBusiness className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Brand</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                          <input
                            type="text"
                            required
                            value={newBrand.name}
                            onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            rows="3"
                            value={newBrand.description}
                            onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Website</label>
                          <input
                            type="url"
                            value={newBrand.website}
                            onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={newBrand.email}
                            onChange={(e) => setNewBrand({...newBrand, email: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            value={newBrand.phone}
                            onChange={(e) => setNewBrand({...newBrand, phone: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address</label>
                          <input
                            type="text"
                            value={newBrand.address}
                            onChange={(e) => setNewBrand({...newBrand, address: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddBrandModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

