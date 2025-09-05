"use client"
import React, { useState } from 'react';
import { MdPayment, MdSearch, MdFilterList, MdCreditCard, MdAccountBalance, MdTrendingUp, MdCheckCircle, MdError } from 'react-icons/md';
import { FaEye, FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const payments = [
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      customer: 'John Doe',
      amount: 1448.00,
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-01-15',
      transactionId: 'TXN123456789',
      fee: 2.9,
      netAmount: 1407.21
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      customer: 'Jane Smith',
      amount: 899.00,
      method: 'PayPal',
      status: 'Completed',
      date: '2024-01-16',
      transactionId: 'TXN987654321',
      fee: 2.9,
      netAmount: 874.93
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      customer: 'Mike Johnson',
      amount: 1698.00,
      method: 'Credit Card',
      status: 'Pending',
      date: '2024-01-17',
      transactionId: 'TXN456789123',
      fee: 2.9,
      netAmount: 1652.76
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      customer: 'Sarah Wilson',
      amount: 498.00,
      method: 'Apple Pay',
      status: 'Completed',
      date: '2024-01-14',
      transactionId: 'TXN789123456',
      fee: 2.9,
      netAmount: 484.55
    },
    {
      id: 'PAY-005',
      orderId: 'ORD-005',
      customer: 'David Brown',
      amount: 698.00,
      method: 'Credit Card',
      status: 'Failed',
      date: '2024-01-13',
      transactionId: 'TXN456789123',
      fee: 0,
      netAmount: 0
    }
  ];

  const statuses = ['all', 'Completed', 'Pending', 'Failed', 'Refunded'];

  const paymentMethods = [
    { name: 'Credit Card', icon: <FaCreditCard className="w-6 h-6" />, color: 'bg-blue-500', count: 3 },
    { name: 'PayPal', icon: <FaPaypal className="w-6 h-6" />, color: 'bg-blue-600', count: 1 },
    { name: 'Apple Pay', icon: <FaApplePay className="w-6 h-6" />, color: 'bg-black', count: 1 }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <MdCheckCircle className="w-5 h-5 text-green-600" />;
      case 'Pending': return <MdPayment className="w-5 h-5 text-yellow-600" />;
      case 'Failed': return <MdError className="w-5 h-5 text-red-600" />;
      case 'Refunded': return <MdTrendingUp className="w-5 h-5 text-blue-600" />;
      default: return <MdPayment className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.fee, 0);
  const netRevenue = totalRevenue - totalFees;

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage payment transactions and financial data</p>
        </div>
      </div>

      {/* filters and search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments by ID, customer, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* financial overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MdTrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdPayment className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Net Revenue</p>
              <p className="text-xl font-bold text-gray-900">${netRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <MdCreditCard className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-xl font-bold text-gray-900">${totalFees.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MdCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {((payments.filter(p => p.status === 'Completed').length / payments.length) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* payment methods overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.name} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex p-3 rounded-lg text-white mb-3 ${method.color}`}>
                {method.icon}
              </div>
              <div className="font-medium text-gray-900">{method.name}</div>
              <div className="text-sm text-gray-600">{method.count} transactions</div>
            </div>
          ))}
        </div>
      </div>

      {/* payments list */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* payment header */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MdPayment className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{payment.id}</h3>
                  <p className="text-sm text-gray-600">Order: {payment.orderId}</p>
                  <p className="text-xs text-gray-500">{payment.customer}</p>
                </div>
              </div>

              {/* status and actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(payment.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-2">
                    <FaEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* payment details */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-lg font-bold text-green-600">${payment.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="text-sm text-gray-900">{payment.method}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                <p className="text-sm text-gray-900 font-mono">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-sm text-gray-900">{payment.date}</p>
              </div>
            </div>

            {/* fee breakdown */}
            {payment.status === 'Completed' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Processing Fee</p>
                    <p className="text-sm text-gray-900">${payment.fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Amount</p>
                    <p className="text-sm font-bold text-green-600">${payment.netAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fee Rate</p>
                    <p className="text-sm text-gray-900">2.9%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* recent transactions summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{payment.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{payment.method}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">${payment.fee.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm font-bold text-green-600">${payment.netAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

