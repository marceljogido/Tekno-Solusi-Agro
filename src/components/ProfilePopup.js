import Image from 'next/image';

export default function ProfilePopup() {
  return (
    <div className="absolute bottom-20 left-4 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="relative">
        {/* Background Image */}
        <div className="h-24 rounded-t-lg overflow-hidden">
          <Image
            src="/images/farm-background.jpg"
            alt="Background"
            width={300}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Profile Image */}
        <div className="absolute left-4 -bottom-12">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
            <Image
              src="/images/nazlan.png"
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-14 mb-4">
        <h3 className="text-xl font-bold text-gray-800">Muhammad Nazlan Rizqon</h3>
        <p className="text-sm text-gray-600">Sumber Jaya's Owner</p>
        <p className="text-sm text-gray-500">Bandung, Indonesia</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">24</p>
          <p className="text-xs text-gray-600">Fields</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">142</p>
          <p className="text-xs text-gray-600">Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">8</p>
          <p className="text-xs text-gray-600">Workers</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
          <i className="fas fa-user-edit mr-2"></i>
          Edit Profile
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
          <i className="fas fa-cog mr-2"></i>
          Settings
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md">
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
} 