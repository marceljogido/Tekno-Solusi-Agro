'use client';

import { useRouter } from 'next/navigation';

export default function CropProduction() {
  const router = useRouter();
  
  const cards = [
    {
      title: 'Crop Planning',
      description: 'Plan and organize your crop planting schedule efficiently.',
      icon: 'fa-calendar-alt',
      link: '/crop-production/planning'
    },
    {
      title: 'Pesticide Application',
      description: 'Manage and schedule the safe use of pesticides to protect crops from pests.',
      icon: 'fa-spray-can',
      link: '/crop-production/pesticide'
    },
    {
      title: 'Fertilizer Application',
      description: 'Plan and track the application of fertilizers for optimal plant growth.',
      icon: 'fa-fill-drip',
      link: '/crop-production/fertilizer'
    },
    {
      title: 'Media Management',
      description: 'Organize and maintain planting media to ensure healthy crop development.',
      icon: 'fa-layer-group',
      link: '/crop-production/media'
    },
    {
      title: 'Irrigation Management',
      description: 'Monitor and regulate water distribution for efficient irrigation.',
      icon: 'fa-tint',
      link: '/crop-production/irrigation'
    },
    {
      title: 'Harvest Management',
      description: 'Coordinate and track harvest activities to maximize crop yield.',
      icon: 'fa-wheat',
      link: '/crop-production/harvest'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
        </button>
        <h1 className="text-xl font-semibold">Crop Production</h1>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">
        Choose an action to manage your crops effectively.
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <i className={`fas ${card.icon} text-xl`}></i>
              </div>
              <h3 className="text-lg font-semibold ml-4">{card.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{card.description}</p>
            <button 
              onClick={() => router.push(card.link)}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 