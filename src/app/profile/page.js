'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const [personalInfo] = useState({
    firstName: 'Nazlan',
    lastName: 'Rizqon',
    email: 'nazlanrizqon@upi.edu',
    phone: '+6285156850316',
    role: 'Owner'
  });

  const [address] = useState({
    street: 'Jl. Pandanwangi 21-39, Cinunuk',
    city: 'Bandung',
    country: 'Indonesia',
    postalCode: '40625'
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6 relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="p-6 flex items-start -mt-16">
          <div className="w-32 h-32 bg-yellow-300 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src="/images/nazlan.png"
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div className="ml-6 mt-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Nazlan Rizqon</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Sumber Jaya's Owner
              </span>
            </div>
            <p className="text-gray-600 mt-1">Bandung, Indonesia</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          </div>
          <button className="flex items-center text-sm text-green-600 hover:text-green-700">
            <i className="fas fa-edit mr-1"></i>
            Edit
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">First name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={personalInfo.firstName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Last name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={personalInfo.lastName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email address</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={personalInfo.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                value={personalInfo.phone}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Role</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={personalInfo.role}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Address</h2>
          </div>
          <button className="flex items-center text-sm text-green-600 hover:text-green-700">
            <i className="fas fa-edit mr-1"></i>
            Edit
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1">Street address</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={address.street}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={address.city}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Country</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={address.country}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Postal Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={address.postalCode}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 