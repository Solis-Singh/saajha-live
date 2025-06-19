import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Populate form with user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        },
      });
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile(formData);
      setAlert({
        show: true,
        type: 'success',
        message: 'Profile updated successfully!',
      });
      setIsEditing(false);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return <LoadingSpinner fullPage />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 text-white relative overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,theme(colors.violet.800/5%),theme(colors.fuchsia.800/5%),theme(colors.violet.800/5%))] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/1%),transparent_70%)] backdrop-blur-xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <h1 className="text-4xl font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">Your Profile</h1>
        
        {alert.show && (
          <div className="mt-4">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
        )}
        
        <div className="mt-8 bg-white/5 backdrop-blur-sm border border-violet-500/20 shadow-lg shadow-violet-900/20 overflow-hidden rounded-2xl">
          <div className="px-6 py-6 sm:px-8 flex justify-between items-center border-b border-violet-800/20">
            <div>
              <h2 className="text-xl font-medium text-white font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text">Account Information</h2>
              <p className="mt-1 text-sm text-violet-300/90">
                Personal details and preferences
              </p>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-medium text-white bg-white/10 backdrop-blur-sm border border-violet-500/50 rounded-lg hover:bg-white/15 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-violet-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-violet-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 rounded-lg opacity-75 blur"></div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="relative bg-gray-800/80 border-0 text-gray-400 w-full px-4 py-2.5 rounded-lg focus:outline-none"
                      required
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-violet-300/70">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium text-violet-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2 mt-4">
                  <h3 className="text-xl font-medium text-white font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text mb-4">Address</h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2 group">
                      <label htmlFor="address.street" className="block text-sm font-medium text-violet-300 mb-2">
                        Street Address
                      </label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                        <input
                          type="text"
                          id="address.street"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor="address.city" className="block text-sm font-medium text-violet-300 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                        <input
                          type="text"
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor="address.state" className="block text-sm font-medium text-violet-300 mb-2">
                        State / Province
                      </label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                        <input
                          type="text"
                          id="address.state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor="address.zipCode" className="block text-sm font-medium text-violet-300 mb-2">
                        ZIP / Postal Code
                      </label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                        <input
                          type="text"
                          id="address.zipCode"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor="address.country" className="block text-sm font-medium text-violet-300 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                        <input
                          type="text"
                          id="address.country"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          className="relative bg-gray-900/80 border-0 text-white w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-medium text-white bg-white/10 backdrop-blur-sm border border-violet-500/50 rounded-lg hover:bg-white/15 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-2 text-[14px] font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-600 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 relative overflow-hidden group/btn"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="group">
                  <dt className="text-sm font-medium text-violet-300/80">Full Name</dt>
                  <dd className="mt-1 text-lg text-white">{user.name}</dd>
                </div>
                
                <div className="group">
                  <dt className="text-sm font-medium text-violet-300/80">Email Address</dt>
                  <dd className="mt-1 text-lg text-white">{user.email}</dd>
                </div>
                
                <div className="group">
                  <dt className="text-sm font-medium text-violet-300/80">Phone Number</dt>
                  <dd className="mt-1 text-lg text-white">{user.phone || 'Not provided'}</dd>
                </div>
                
                <div className="sm:col-span-2 mt-4">
                  <h3 className="text-xl font-medium text-white font-bungee bg-gradient-to-r from-violet-400 to-fuchsia-400 inline-block text-transparent bg-clip-text mb-4">Address</h3>
                  
                  <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 bg-white/5 p-4 rounded-xl">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-violet-300/80">Street Address</dt>
                      <dd className="mt-1 text-lg text-white">{user.address?.street || 'Not provided'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-violet-300/80">City</dt>
                      <dd className="mt-1 text-lg text-white">{user.address?.city || 'Not provided'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-violet-300/80">State / Province</dt>
                      <dd className="mt-1 text-lg text-white">{user.address?.state || 'Not provided'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-violet-300/80">ZIP / Postal Code</dt>
                      <dd className="mt-1 text-lg text-white">{user.address?.zipCode || 'Not provided'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-violet-300/80">Country</dt>
                      <dd className="mt-1 text-lg text-white">{user.address?.country || 'Not provided'}</dd>
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          )}
          
          <div className="px-6 py-4 sm:px-8 border-t border-violet-800/20 flex justify-end">
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-medium text-white bg-white/10 backdrop-blur-sm border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;