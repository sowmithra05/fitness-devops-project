import React, { useState, useEffect } from 'react'
import { nutritionService } from '../services/api'
import FormModal from '../components/FormModal'
import { format } from 'date-fns'
import { Apple, Plus, Calendar, Flame, TrendingUp, Droplets, Utensils, Zap } from 'lucide-react'

function Nutrition() {
  const [nutrition, setNutrition] = useState([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  useEffect(() => {
    loadNutrition()
  }, [selectedDate])

  const loadNutrition = async () => {
    try {
      const response = await nutritionService.getByDate(selectedDate)
      setNutrition(response.data)
    } catch (error) {
      console.error('Error loading nutrition:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (nutritionData) => {
    try {
      await nutritionService.create({
        ...nutritionData,
        date: selectedDate
      })
      await loadNutrition()
      setShowModal(false)
    } catch (error) {
      console.error('Error saving nutrition:', error)
    }
  }

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🍳', gradient: 'from-yellow-500 to-orange-500' },
    { value: 'lunch', label: 'Lunch', icon: '🥗', gradient: 'from-green-500 to-emerald-500' },
    { value: 'dinner', label: 'Dinner', icon: '🍽️', gradient: 'from-purple-500 to-pink-500' },
    { value: 'snack', label: 'Snacks', icon: '🍎', gradient: 'from-red-500 to-rose-500' }
  ]

  const totals = nutrition.reduce((acc, entry) => {
    acc.calories += entry.totalCalories || 0
    acc.items += entry.foodItems?.length || 0
    return acc
  }, { calories: 0, items: 0 })

  const waterIntake = nutrition.find(entry => entry.waterIntake)?.waterIntake || 0

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Apple className="text-green-600" size={32} />
            <span>Nutrition Tracker</span>
          </h1>
          <p className="text-gray-600 mt-2 flex items-center space-x-2">
            <Calendar size={16} />
            <span>{format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-white font-medium"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* Daily Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Calories"
          value={totals.calories}
          subtitle="kcal consumed today"
          icon={<Flame size={28} />}
          gradient="from-orange-500 to-red-500"
        />
        
        <SummaryCard
          title="Food Items"
          value={totals.items}
          subtitle="meals logged"
          icon={<Utensils size={28} />}
          gradient="from-green-500 to-emerald-500"
        />
        
        <SummaryCard
          title="Water Intake"
          value={`${waterIntake}/8`}
          subtitle="glasses consumed"
          icon={<Droplets size={28} />}
          gradient="from-blue-500 to-cyan-500"
        />
      </section>

      {/* Today's Meals */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <Utensils className="text-green-600" size={28} />
          <span>Today's Meals</span>
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {mealTypes.map((mealType) => {
            const mealEntries = nutrition.filter(entry => entry.mealType === mealType.value)
            const mealCalories = mealEntries.reduce((sum, entry) => sum + (entry.totalCalories || 0), 0)
            const mealItems = mealEntries.reduce((sum, entry) => sum + (entry.foodItems?.length || 0), 0)

            return (
              <div key={mealType.value} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${mealType.gradient}`}></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${mealType.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                        {mealType.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl">{mealType.label}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Utensils size={14} className="mr-1" />
                            {mealItems} items
                          </span>
                          <span className="text-sm text-gray-600 flex items-center">
                            <Flame size={14} className="mr-1" />
                            {mealCalories} kcal
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${mealType.gradient} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                  {mealEntries.length > 0 ? (
                    <div className="space-y-3 mt-4">
                      {mealEntries.map((entry) => (
                        <div key={entry._id}>
                          {entry.foodItems?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-xs text-gray-600">
                                    <span className="font-medium">P:</span> {item.protein}g
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    <span className="font-medium">C:</span> {item.carbs}g
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    <span className="font-medium">F:</span> {item.fat}g
                                  </span>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${mealType.gradient} text-white text-sm font-bold`}>
                                {item.calories} kcal
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No items logged for this meal</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Water Intake */}
      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Droplets className="text-blue-500" size={28} />
            <span>Water Intake</span>
          </h2>
          <span className="text-lg font-semibold text-gray-700">{waterIntake} / 8 glasses</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
              <div
                key={glass}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transform transition-all duration-300 ${
                  glass <= waterIntake
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-gray-100 border-gray-300 text-gray-400 hover:scale-105'
                }`}
              >
                💧
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSubmit({
              mealType: 'snack',
              foodItems: [],
              waterIntake: Math.min(8, waterIntake + 1)
            })}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Add Glass</span>
          </button>
        </div>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${(waterIntake / 8) * 100}%` }}
          ></div>
        </div>
      </section>

      {/* Add Food Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingEntry(null)
        }}
        title="Add Food Entry"
      >
        <NutritionForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </FormModal>
    </div>
  )
}

function SummaryCard({ title, value, subtitle, icon, gradient }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          {icon}
        </div>
        
        <div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function NutritionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodItems: [{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }],
    waterIntake: 0
  })

  const handleFoodItemChange = (index, field, value) => {
    const updatedFoodItems = [...formData.foodItems]
    updatedFoodItems[index] = {
      ...updatedFoodItems[index],
      [field]: field === 'name' ? value : Number(value)
    }
    
    setFormData(prev => ({
      ...prev,
      foodItems: updatedFoodItems,
      totalCalories: updatedFoodItems.reduce((sum, item) => sum + (item.calories || 0), 0)
    }))
  }

  const addFoodItem = () => {
    setFormData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }]
    }))
  }

  const removeFoodItem = (index) => {
    if (formData.foodItems.length > 1) {
      const updatedFoodItems = formData.foodItems.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, foodItems: updatedFoodItems }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const validFoodItems = formData.foodItems.filter(item => item.name.trim() !== '')
    
    if (validFoodItems.length === 0 && formData.waterIntake === 0) {
      alert('Please add at least one food item or water intake')
      return
    }

    onSubmit({
      ...formData,
      foodItems: validFoodItems,
      totalCalories: validFoodItems.reduce((sum, item) => sum + (item.calories || 0), 0)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
        <select
          value={formData.mealType}
          onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Food Items</label>
        <div className="space-y-3">
          {formData.foodItems.map((item, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-4 space-y-3 hover:border-green-300 transition-colors">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Food Item {index + 1}</h4>
                {formData.foodItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFoodItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Food Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                  placeholder="e.g., Greek Yogurt Parfait"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    value={item.calories}
                    onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.protein}
                    onChange={(e) => handleFoodItemChange(index, 'protein', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.carbs}
                    onChange={(e) => handleFoodItemChange(index, 'carbs', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.fat}
                    onChange={(e) => handleFoodItemChange(index, 'fat', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={addFoodItem}
          className="mt-3 flex items-center space-x-2 text-green-600 hover:text-green-800 font-medium text-sm px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
        >
          <Plus size={16} />
          <span>Add Another Food Item</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Water Intake (glasses)</label>
        <input
          type="number"
          min="0"
          max="20"
          value={formData.waterIntake}
          onChange={(e) => setFormData(prev => ({ ...prev, waterIntake: parseInt(e.target.value) }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Add Entry
        </button>
      </div>
    </form>
  )
}

export default Nutrition