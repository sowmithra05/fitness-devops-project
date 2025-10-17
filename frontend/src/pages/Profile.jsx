import React, { useState, useEffect } from 'react'
import { userService } from '../services/api'
import { User, Mail, Phone, Calendar, Activity, Target, TrendingUp, Save, AlertCircle, CheckCircle, Zap } from 'lucide-react'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile()
      setProfile(response)
    } catch (error) {
      console.error('Error loading profile:', error)
      setMessage('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await userService.updateProfile(profile)
      setMessage('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('error')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
        <p className="text-xl text-gray-600">Error loading profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-8 py-12 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-white border-opacity-30">
              {profile.firstName?.charAt(0) || 'U'}{profile.lastName?.charAt(0) || ''}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-xl text-blue-100 font-light">Manage your personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`flex items-center space-x-3 p-4 rounded-xl shadow-lg animate-pulse ${
          message === 'success' 
            ? 'bg-green-100 text-green-700 border-2 border-green-300' 
            : 'bg-red-100 text-red-700 border-2 border-red-300'
        }`}>
          {message === 'success' ? (
            <>
              <CheckCircle size={24} />
              <span className="font-semibold">Profile updated successfully!</span>
            </>
          ) : (
            <>
              <AlertCircle size={24} />
              <span className="font-semibold">Error updating profile. Please try again.</span>
            </>
          )}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <User className="text-blue-600" size={28} />
            <span>Personal Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              required
              icon={<User size={18} />}
              value={profile.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter your first name"
            />

            <FormField
              label="Last Name"
              required
              icon={<User size={18} />}
              value={profile.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter your last name"
            />

            <FormField
              label="Email Address"
              type="email"
              required
              icon={<Mail size={18} />}
              value={profile.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              helperText="Used for account access and notifications"
            />

            <FormField
              label="Phone Number"
              type="tel"
              icon={<Phone size={18} />}
              value={profile.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="(123) 456-7890"
              helperText="For SMS notifications and account recovery"
            />

            <FormField
              label="Date of Birth"
              type="date"
              icon={<Calendar size={18} />}
              value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              helperText="Used to calculate age-appropriate recommendations"
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                value={profile.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Helps personalize fitness and nutrition recommendations
              </p>
            </div>
          </div>
        </section>

        {/* Health Metrics Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Activity className="text-green-600" size={28} />
            <span>Health Metrics</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Height"
              icon={<TrendingUp size={18} />}
              value={profile.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="5'10&quot;"
              helperText="Used for BMI and calorie calculations"
            />

            <FormField
              label="Weight (lbs)"
              type="number"
              icon={<Activity size={18} />}
              value={profile.weight || ''}
              onChange={(e) => handleChange('weight', parseInt(e.target.value) || '')}
              placeholder="150"
              helperText="Used for progress tracking and goal setting"
            />
          </div>
        </section>

        {/* Fitness Profile Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <Target className="text-purple-600" size={28} />
            <span>Fitness Profile</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
              <select
                value={profile.activityLevel || ''}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Activity Level</option>
                <option value="Sedentary">🛋️ Sedentary (little to no exercise)</option>
                <option value="Light">🚶 Light (light exercise 1-3 days/week)</option>
                <option value="Moderate">🏃 Moderate (moderate exercise 3-5 days/week)</option>
                <option value="Active">💪 Active (hard exercise 6-7 days/week)</option>
                <option value="Very Active">🔥 Very Active (very hard exercise, physical job)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Helps calculate daily calorie needs
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Fitness Goal</label>
              <select
                value={profile.fitnessGoal || ''}
                onChange={(e) => handleChange('fitnessGoal', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select Goal</option>
                <option value="Weight Loss">📉 Weight Loss</option>
                <option value="Muscle Gain">💪 Muscle Gain</option>
                <option value="Maintenance">⚖️ Maintenance</option>
                <option value="Endurance">🏃 Endurance</option>
                <option value="General Fitness">🎯 General Fitness</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Personalizes recommendations and tracking focus
              </p>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Update Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function FormField({ label, required, icon, helperText, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors`}
          required={required}
        />
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
}

export default Profile