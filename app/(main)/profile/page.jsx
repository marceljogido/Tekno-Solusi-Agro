"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  
  // Crop states
  const [crop, setCrop] = useState();
  const [imgSrc, setImgSrc] = useState('');
  const [imgRef, setImgRef] = useState(null);
  const [cropType, setCropType] = useState(''); // 'profile' or 'background'
  const [showCropModal, setShowCropModal] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setEditedUser(data.user);
          setProfilePreview(data.user.profileImage || null);
          setBackgroundPreview(data.user.backgroundImage || null);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const aspect = cropType === 'profile' ? 1 : 16/9;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImgSrc(reader.result?.toString() || '');
          setCropType(name === 'profileImageFile' ? 'profile' : 'background');
          setShowCropModal(true);
        });
        reader.readAsDataURL(file);
      }
    } else {
      setEditedUser({ ...editedUser, [name]: value });
    }
  };

  const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
    if (!imgRef || !croppedAreaPixels || isCropping) return;

    try {
      setIsCropping(true);
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;

      // Set canvas size to match the cropped area
      const targetWidth = cropType === 'profile' ? 400 : 1200; // Fixed sizes for better quality
      const targetHeight = cropType === 'profile' ? 400 : 675; // Maintain aspect ratio
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Draw the cropped image
      ctx.drawImage(
        imgRef,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          if (cropType === 'profile') {
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(blob));
          } else {
            setBackgroundFile(file);
            setBackgroundPreview(URL.createObjectURL(blob));
          }
        }
        setIsCropping(false);
        setShowCropModal(false);
        setImgSrc('');
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsCropping(false);
      setShowCropModal(false);
      setImgSrc('');
    }
  };

  const handleApplyCrop = () => {
    if (!crop || !imgRef) return;
    
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;
    
    const croppedAreaPixels = {
      x: Math.round(crop.x * scaleX),
      y: Math.round(crop.y * scaleY),
      width: Math.round(crop.width * scaleX),
      height: Math.round(crop.height * scaleY),
    };
    
    handleCropComplete(crop, croppedAreaPixels);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser(user);
    setProfileFile(null);
    setBackgroundFile(null);
    setProfilePreview(user?.profileImage || null);
    setBackgroundPreview(user?.backgroundImage || null);
    if (profilePreview && profilePreview.startsWith('blob:')) URL.revokeObjectURL(profilePreview);
    if (backgroundPreview && backgroundPreview.startsWith('blob:')) URL.revokeObjectURL(backgroundPreview);
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', editedUser.firstName || '');
      formData.append('lastName', editedUser.lastName || '');
      formData.append('phone', editedUser.phone || '');
      formData.append('role', editedUser.role || '');
      formData.append('address', editedUser.address || '');
      if (profileFile) {
        formData.append('profileImageFile', profileFile);
      }
      if (backgroundFile) {
        formData.append('backgroundImageFile', backgroundFile);
      }

      const response = await fetch('/api/user', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData.user);
        setEditedUser(updatedData.user);
        setIsEditing(false);
        console.log('User data saved successfully', updatedData);
      } else {
        const errorText = await response.text();
        console.error('Failed to save user data', response.status, errorText);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title="User Profile" />
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 relative overflow-hidden">
          <div className="h-32 sm:h-40 md:h-48 w-full relative group cursor-pointer" onClick={() => isEditing && document.getElementById('backgroundInput')?.click()}>
            {backgroundPreview ? (
              <Image 
                src={backgroundPreview} 
                alt="Background" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-sm">No Background Image</div>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-center">Change Background Image</span>
                <input type="file" id="backgroundInput" name="backgroundImageFile" accept="image/*" className="hidden" onChange={handleInputChange} />
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start -mt-16 md:-mt-20">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-300 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 relative group cursor-pointer" onClick={() => isEditing && document.getElementById('profileInput')?.click()}>
              {profilePreview ? (
                <Image 
                  src={profilePreview} 
                  alt={user.firstName} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 96px, 128px"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <i className="fas fa-user text-gray-400 text-4xl"></i>
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-center">Change Profile Image</span>
                  <input type="file" id="profileInput" name="profileImageFile" accept="image/*" className="hidden" onChange={handleInputChange} />
                </div>
              )}
            </div>
            <div className="md:ml-6 mt-4 md:mt-20 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{editedUser.firstName} {editedUser.lastName}</h1>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                  {editedUser.role || "User"}
                </span>
              </div>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm">{editedUser.address || "Location not set"}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>
            {!isEditing ? (
              <button onClick={handleEditClick} className="flex items-center text-sm text-green-600 hover:text-green-700">
                <i className="fas fa-edit mr-1"></i>
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSaveClick} className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  Save
                </button>
                <button onClick={handleCancelClick} className="flex items-center text-sm text-gray-600 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1">First name</label>
                <input type="text" className="w-full p-2 border rounded-md" value={editedUser.firstName || ''} readOnly={!isEditing} name="firstName" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Last name</label>
                <input type="text" className="w-full p-2 border rounded-md" value={editedUser.lastName || ''} readOnly={!isEditing} name="lastName" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Email address</label>
                <input type="email" className="w-full p-2 border rounded-md" value={editedUser.email || ''} readOnly name="email" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Phone</label>
                <input type="tel" className="w-full p-2 border rounded-md" value={editedUser.phone || ''} readOnly={!isEditing} name="phone" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Role</label>
                {isEditing ? (
                  <input type="text" className="w-full p-2 border rounded-md" value={editedUser.role || ''} name="role" onChange={handleInputChange} />
                ) : (
                  <input type="text" className="w-full p-2 border rounded-md" value={editedUser.role || ''} readOnly />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Address</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Street address</label>
                <input type="text" className="w-full p-2 border rounded-md" value={editedUser.address || ''} readOnly={!isEditing} name="address" onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && imgSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
            <div className="max-h-[70vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={cropType === 'profile' ? 1 : 16/9}
                className="max-w-full"
              >
                <img
                  ref={setImgRef}
                  src={imgSrc}
                  onLoad={onImageLoad}
                  alt="Crop preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setImgSrc('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
                disabled={isCropping}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCropping || !crop}
              >
                {isCropping ? 'Processing...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 