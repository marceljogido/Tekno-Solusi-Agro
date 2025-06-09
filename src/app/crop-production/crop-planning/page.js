'use client'; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import CropPlanningTable from '@/components/crop-production/CropPlanningTable';
// Reverted import name back to NewCropForm
import NewCropForm from '@/components/crop-production/NewCropForm';
// Import Sidebar component if it's separate and needed here
// import Sidebar from '@/components/layout/Sidebar'; 

export default function CropPlanningPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State to hold the list of crops
  const [crops, setCrops] = useState([]);
  // Counter for generating unique IDs (replace with actual ID generation later)
  const [nextId, setNextId] = useState(1);
  // State to track the crop being edited
  const [editingCrop, setEditingCrop] = useState(null);

  // --- CRUD Operations ---

  // Create or Update
  const handleSaveCrop = (formData) => {
    if (editingCrop) {
      // Update existing crop
      console.log('Updating crop:', { ...formData, id: editingCrop.id });
      setCrops(prevCrops => prevCrops.map(crop =>
        crop.id === editingCrop.id ? { ...formData, id: editingCrop.id } : crop
      ));
      // TODO: API call to update data
      setEditingCrop(null); // Reset editing state
    } else {
      // Create new crop
      console.log('Saving new crop:', formData);
      const newCrop = { ...formData, id: nextId };
      setNextId(prevId => prevId + 1);
      setCrops(prevCrops => [...prevCrops, newCrop]);
      // TODO: API call to save new data
    }
    handleCloseForm();
  };

  // Read (Initial data fetching - example using useEffect, replace with actual API call)
  useEffect(() => {
    // Simulate fetching initial data - replace with actual API call
    const fetchedCrops = [
       // You can put some initial dummy data here again if needed for testing
       // { id: 1, cropType: 'Chilli', variety: 'Jalapeno', area: '1000 sqm' }, // Example data structure
    ];
    // Find the highest ID if fetching existing data to set the nextId correctly
    const maxId = fetchedCrops.reduce((max, crop) => Math.max(max, crop.id || 0), 0);
    setNextId(maxId + 1);
    setCrops(fetchedCrops);
    console.log("Initial crops loaded (simulated)");
  }, []); // Empty dependency array means this runs once on mount

  // Delete
  const handleDeleteCrop = (cropId) => {
    // Optional: Add confirmation dialog
    if (window.confirm('Are you sure you want to delete this crop?')) {
        console.log("Deleting crop ID:", cropId);
        setCrops(prevCrops => prevCrops.filter(crop => crop.id !== cropId));
        // TODO: API call to delete data from backend
    }
  };

  // --- Modal Handlers ---
  const handleOpenForm = () => {
    setEditingCrop(null); // Ensure we are adding, not editing
    setIsFormOpen(true);
  };

  // Function to open the form for editing
  const handleOpenEditForm = (cropToEdit) => {
    console.log("Editing crop:", cropToEdit);
    setEditingCrop(cropToEdit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCrop(null); // Clear editing state when form closes
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Assuming you have a Sidebar component you want to include */} 
      {/* <Sidebar /> */}
      
      {/* Main Content Area */} 
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
         {/* You might want a header/breadcrumb here like in the image */}
         <div className="mb-6">
            {/* Example Breadcrumb - Adjust as needed */} 
             <nav className="text-sm mb-4" aria-label="Breadcrumb">
               <ol className="list-none p-0 inline-flex space-x-2">
                 <li className="flex items-center">
                   <a href="#" className="text-gray-500 hover:text-gray-700">Crop Production</a>
                 </li>
                 <li>
                   <span className="text-gray-400">/</span>
                 </li>
                 <li className="flex items-center">
                   <span className="text-gray-700 font-medium">Crop Planning</span>
                 </li>
               </ol>
             </nav>
              {/* Page Title moved inside the table component now */}
              {/* <h1 className="text-2xl font-semibold text-gray-800">Crop Planning</h1> */}
         </div>

        {/* Pass crops data and CRUD handlers down to the table */}
        <CropPlanningTable
           crops={crops}
           onAddNewCrop={handleOpenForm}
           onEditCrop={handleOpenEditForm} // Pass edit handler
           onDeleteCrop={handleDeleteCrop} // Pass delete handler
         />

        {/* Pass initialData to the form when editing */}
        {isFormOpen && (
          <NewCropForm
            onClose={handleCloseForm}
            onSave={handleSaveCrop}
            initialData={editingCrop} // Pass the crop data if editing, otherwise null
          />
        )}
      </main>
    </div>
  );
} 