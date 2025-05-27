'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddNewPlanForm from '@/components/crop-production/AddNewPlanForm';

export default function EditPlantingPage({ params }) {
  const router = useRouter();
  const [planting, setPlanting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanting = async () => {
      try {
        const response = await fetch(`/api/plantings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch planting data');
        }
        const data = await response.json();
        setPlanting(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanting();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!planting) {
    return <div className="p-8">Planting not found</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-800">←</button>
        <h1 className="text-2xl font-bold">Edit Rencana Tanam</h1>
      </div>
      <AddNewPlanForm 
        onClose={() => router.push('/crop-production/crop-planning')}
        initialData={planting}
      />
    </div>
  );
} 