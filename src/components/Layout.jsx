'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Layout({ children }) {
    const router = useRouter();

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-white h-screen shadow-md">
                <div className="p-4 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-lg font-semibold">Tekno Solusi Agro</span>
                </div>
                <div className="p-4">
                    <button className="w-full bg-green-600 text-white py-2 rounded-md">+ New Task</button>
                </div>
                <nav className="mt-4">
                    <ul>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/dashboard" className="flex items-center w-full">
                                <i className="fas fa-tachometer-alt mr-2"></i>
                                Dashboard
                            </Link>
                        </li>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/monitoring" className="flex items-center w-full">
                                <i className="fas fa-eye mr-2"></i>
                                Monitoring
                            </Link>
                        </li>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/crop-production" className="flex items-center w-full">
                                <i className="fas fa-seedling mr-2"></i>
                                Crop Production
                            </Link>
                        </li>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/resources" className="flex items-center w-full">
                                <i className="fas fa-box-open mr-2"></i>
                                Resources
                            </Link>
                        </li>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/insights" className="flex items-center w-full">
                                <i className="fas fa-chart-line mr-2"></i>
                                Insights
                            </Link>
                        </li>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/notifications" className="flex items-center w-full">
                                <i className="fas fa-bell mr-2"></i>
                                Notifications
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">9+</span>
                            </Link>
                        </li>
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer">
                            <Link href="/settings" className="flex items-center w-full">
                                <i className="fas fa-cog mr-2"></i>
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto p-4">
                    <div className="flex items-center">
                        <Image
                            src="/profile-picture.png"
                            alt="Profile picture"
                            width={40}
                            height={40}
                            className="rounded-full mr-2"
                        />
                        <div>
                            <p className="font-semibold">Nazlan Rizqon</p>
                            <p className="text-sm text-gray-600">nazlanrizqon@upi.edu</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-md flex items-center justify-center">
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Log out
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100">
                {children}
            </div>
        </div>
    );
} 