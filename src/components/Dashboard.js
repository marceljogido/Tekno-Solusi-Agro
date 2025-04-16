import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Dashboard() {
  const chartData = {
    labels: ['Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        fill: true,
        label: 'Growth',
        data: [10, 25, 45, 30, 60, 20, 35, 55],
        borderColor: 'rgb(22, 163, 74)',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Good Morning, Nazlan! 👋</h1>
          <p className="text-gray-600">here's what's happening with your field today</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Export
          </button>
        </div>
      </div>

      {/* Farm Info */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8 bg-white rounded-lg p-4 relative">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold">Sumber Jaya Farm</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-50 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg"></div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Total Land Area</h3>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold mb-2">10.4 Hectares</p>
            <p className="text-sm text-green-500">70% Planted</p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Revenue</h3>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold mb-2">Rp. 12.350.000</p>
            <p className="text-sm text-green-500">+12% from last month</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
              </svg>
              <span>Cileunyi</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold mb-1">23°C</p>
                <p className="text-sm opacity-90">Clear</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Humidity 83%</p>
                <p className="text-sm opacity-90">Day 24° • Night 19°</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-4">Vegetable Harvest Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500">🌾</span>
                <span>Paddy</span>
              </div>
              <span className="font-medium">100 Kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-orange-500">🥕</span>
                <span>Carrot</span>
              </div>
              <span className="font-medium">96.8 Kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-red-500">🌶️</span>
                <span>Chili</span>
              </div>
              <span className="font-medium">80.2 Kg</span>
            </div>
          </div>
          <button className="w-full mt-4 text-center text-green-600 hover:text-green-700">
            See All
          </button>
        </div>

        <div className="col-span-4 bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-4">Quantity of students helped</h3>
          <div className="flex justify-center items-center h-48">
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">2,300+</p>
              <p className="text-gray-500">Students</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Growth</h3>
            <select className="text-sm border-none bg-transparent">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="h-48">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
} 