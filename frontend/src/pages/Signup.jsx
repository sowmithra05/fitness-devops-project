import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    fitnessGoal: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await signup(formData)
    
    if (result.success) {
      navigate('/')
    } else {
      setMessage(result.message)
    }
    
    setLoading(false)
  }

  const nextStep = () => {
    if (step === 1 && formData.firstName && formData.lastName && formData.email && formData.password) {
      setStep(2)
      setMessage('')
    } else if (step === 1) {
      setMessage('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setStep(1)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 py-12">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Join FitCircle
              </h2>
              <p className="text-purple-100">
                Start your transformation journey today
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                Account Info
              </span>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                Fitness Profile
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="px-8 py-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {message && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{message}</span>
                  </div>
                </div>
              )}

              {/* Step 1: Account Information */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="John"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Continue to Fitness Profile
                  </button>
                </div>
              )}

              {/* Step 2: Fitness Profile */}
              {step === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <label htmlFor="height" className="block text-sm font-semibold text-gray-700">
                        Height
                      </label>
                      <input
                        id="height"
                        name="height"
                        type="text"
                        placeholder="5'10&quot; or 178cm"
                        value={formData.height}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">
                        Weight (lbs)
                      </label>
                      <input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="150"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || '' }))}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-2">
                      <label htmlFor="activityLevel" className="block text-sm font-semibold text-gray-700">
                        Activity Level
                      </label>
                      <select
                        id="activityLevel"
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                      >
                        <option value="">Select Activity Level</option>
                        <option value="Sedentary">Sedentary (Little or no exercise)</option>
                        <option value="Light">Light (1-3 days/week)</option>
                        <option value="Moderate">Moderate (3-5 days/week)</option>
                        <option value="Active">Active (6-7 days/week)</option>
                        <option value="Very Active">Very Active (Intense daily)</option>
                      </select>
                    </div>

                    {/* Fitness Goal */}
                    <div className="space-y-2">
                      <label htmlFor="fitnessGoal" className="block text-sm font-semibold text-gray-700">
                        Primary Fitness Goal
                      </label>
                      <select
                        id="fitnessGoal"
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                      >
                        <option value="">Select Goal</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Endurance">Endurance</option>
                        <option value="General Fitness">General Fitness</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-200 ${
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-105 active:scale-95'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </div>
                      ) : (
                        'Create My Account'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Your data is secure and encrypted
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Signup