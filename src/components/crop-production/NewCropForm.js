import React, { useState, useEffect } from 'react';

// Accept initialData prop
const NewCropForm = ({ onClose, onSave, initialData }) => {
  const defaultFormData = {
    cropType: '',
    variety: '',
    botanicalName: '',
    daysToEmerge: '0',
    plantSpacing: '0',
    rowSpacing: '0',
    plantingDepth: '0',
    averageHeight: '0',
    startMethod: 'Start in trays, transplant in ground',
    germinationRate: '100',
    seedPerCell: '1',
    soilCondition: '',
    daysToFlower: '0',
    daysToMaturity: '0',
    harvestWindow: '0',
    lossRate: '0',
    harvestUnit: 'Kilogram',
    estimatedRevenue: '',
    expectedYield: '100',
  };

  // Initialize state with initialData if provided, otherwise use defaults
  const [formData, setFormData] = useState(initialData || defaultFormData);

  // Effect to update form data if initialData changes (e.g., when editing a different item)
  useEffect(() => {
    if (initialData) {
        console.log("Setting form data from initialData:", initialData);
        setFormData(initialData);
    } else {
        console.log("Resetting form data to default");
        setFormData(defaultFormData); // Reset to defaults when adding new
    }
    // Dependency array includes initialData to re-run effect when it changes
  }, [initialData]);

  // Generic handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default page reload
    console.log("Form submitted:", formData);
    // TODO: Add validation if needed
    onSave(formData); // Pass the form data to the parent component
  };

  // Determine if we are editing based on initialData prop
  const isEditing = !!initialData;

  console.log("Original NewCropForm rendered!"); // Add log

  // Restore the original complex form JSX
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          {/* Change title based on editing state */}
          <h2 className="text-xl font-semibold text-green-700">{isEditing ? 'Edit Crop' : 'New Crop'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {/* Changed form tag to include onSubmit */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type & Variety Section */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Type & Variety</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-600 mb-1">Crop Type</label>
                <input value={formData.cropType} onChange={handleChange} type="text" id="cropType" name="cropType" placeholder="e.g. Apple" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="variety" className="block text-sm font-medium text-gray-600 mb-1">Variety</label>
                <input value={formData.variety} onChange={handleChange} type="text" id="variety" name="variety" placeholder="e.g sweet apple" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="botanicalName" className="block text-sm font-medium text-gray-600 mb-1">Botanical name</label>
                <input value={formData.botanicalName} onChange={handleChange} type="text" id="botanicalName" name="botanicalName" placeholder="Malus pumila" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
          </div>

          {/* Planting Details Section */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Planting Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="daysToEmerge" className="block text-sm font-medium text-gray-600 mb-1">Days to emerge</label>
                <div className="relative">
                  <input value={formData.daysToEmerge} onChange={handleChange} type="number" id="daysToEmerge" name="daysToEmerge" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">days</span>
                </div>
              </div>
              <div>
                <label htmlFor="plantSpacing" className="block text-sm font-medium text-gray-600 mb-1">Plant spacing</label>
                 <div className="relative">
                    <input value={formData.plantSpacing} onChange={handleChange} type="number" id="plantSpacing" name="plantSpacing" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">m</span>
                 </div>
              </div>
               <div>
                <label htmlFor="rowSpacing" className="block text-sm font-medium text-gray-600 mb-1">Row spacing</label>
                 <div className="relative">
                    <input value={formData.rowSpacing} onChange={handleChange} type="number" id="rowSpacing" name="rowSpacing" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">m</span>
                 </div>
              </div>
              <div>
                <label htmlFor="plantingDepth" className="block text-sm font-medium text-gray-600 mb-1">Planting depth</label>
                 <div className="relative">
                    <input value={formData.plantingDepth} onChange={handleChange} type="number" id="plantingDepth" name="plantingDepth" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">cm</span>
                 </div>
              </div>
               <div>
                <label htmlFor="averageHeight" className="block text-sm font-medium text-gray-600 mb-1">Average height</label>
                 <div className="relative">
                    <input value={formData.averageHeight} onChange={handleChange} type="number" id="averageHeight" name="averageHeight" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">cm</span>
                 </div>
              </div>
              <div>
                <label htmlFor="startMethod" className="block text-sm font-medium text-gray-600 mb-1">Start method</label>
                <select value={formData.startMethod} onChange={handleChange} id="startMethod" name="startMethod" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white">
                  <option>Start in trays, transplant in ground</option>
                  {/* Add other options here */}
                  <option>Direct sow</option>
                </select>
              </div>
              <div>
                <label htmlFor="germinationRate" className="block text-sm font-medium text-gray-600 mb-1">Estimated Germination Rate</label>
                 <div className="relative">
                    <input value={formData.germinationRate} onChange={handleChange} type="number" id="germinationRate" name="germinationRate" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">%</span>
                 </div>
              </div>
              <div>
                <label htmlFor="seedPerCell" className="block text-sm font-medium text-gray-600 mb-1">Seed per cell</label>
                <input value={formData.seedPerCell} onChange={handleChange} type="number" id="seedPerCell" name="seedPerCell" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
               <div className="md:col-span-2">
                 <label htmlFor="soilCondition" className="block text-sm font-medium text-gray-600 mb-1">Soil condition</label>
                 <select value={formData.soilCondition} onChange={handleChange} id="soilCondition" name="soilCondition" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white">
                   <option value="">Select soil condition</option>
                   {/* Add options like: Loamy, Sandy, Clay, etc. */}
                   <option>Loamy</option>
                   <option>Sandy</option>
                   <option>Clay</option>
                   <option>Silty</option>
                   <option>Peaty</option>
                   <option>Chalky</option>
                 </select>
               </div>
            </div>
          </div>

          {/* Harvest Details Section */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Harvest details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label htmlFor="daysToFlower" className="block text-sm font-medium text-gray-600 mb-1">Days to flower</label>
                 <div className="relative">
                   <input value={formData.daysToFlower} onChange={handleChange} type="number" id="daysToFlower" name="daysToFlower" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                   <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">days</span>
                 </div>
               </div>
               <div>
                 <label htmlFor="daysToMaturity" className="block text-sm font-medium text-gray-600 mb-1">Days to maturity</label>
                 <div className="relative">
                   <input value={formData.daysToMaturity} onChange={handleChange} type="number" id="daysToMaturity" name="daysToMaturity" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                   <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">days</span>
                 </div>
               </div>
              <div>
                <label htmlFor="harvestWindow" className="block text-sm font-medium text-gray-600 mb-1">Harvest window</label>
                <div className="relative">
                  <input value={formData.harvestWindow} onChange={handleChange} type="number" id="harvestWindow" name="harvestWindow" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">days</span>
                </div>
              </div>
              <div>
                <label htmlFor="lossRate" className="block text-sm font-medium text-gray-600 mb-1">Estimated loss rate</label>
                 <div className="relative">
                    <input value={formData.lossRate} onChange={handleChange} type="number" id="lossRate" name="lossRate" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">%</span>
                 </div>
              </div>
               <div>
                 <label htmlFor="harvestUnit" className="block text-sm font-medium text-gray-600 mb-1">Harvest unit</label>
                 <select value={formData.harvestUnit} onChange={handleChange} id="harvestUnit" name="harvestUnit" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white">
                   <option>Kilogram</option>
                   <option>Ton</option>
                   <option>Pieces</option>
                   {/* Add other relevant units */}
                 </select>
               </div>
               <div>
                  <label htmlFor="estimatedRevenue" className="block text-sm font-medium text-gray-600 mb-1">Estimated revenue</label>
                  <div className="flex items-center">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">Rp.</span>
                      <input value={formData.estimatedRevenue} onChange={handleChange} type="number" id="estimatedRevenue" name="estimatedRevenue" placeholder="1.000.000" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">per harvest unit</span>
                  </div>
               </div>
               <div className="md:col-span-2">
                 <label htmlFor="expectedYield" className="block text-sm font-medium text-gray-600 mb-1">Expected Yield per hectare</label>
                 {/* Assuming % means yield percentage compared to a benchmark, adjust if it means something else */}
                  <div className="relative">
                      <input value={formData.expectedYield} onChange={handleChange} type="number" id="expectedYield" name="expectedYield" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">%</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {/* Change button text based on editing state */}
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Changed export back to NewCropForm
export default NewCropForm; 