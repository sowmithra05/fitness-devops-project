import React, { useState, useEffect } from 'react'
import { nutritionService } from '../services/api'
import FormModal from '../components/FormModal'
import { format } from 'date-fns'
import { Target, Plus, Edit2, Trash2, TrendingUp, Award, Zap, Calendar } from 'lucide-react'

function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      const response = await nutritionService.getGoals()
      setGoals(response.data)
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (goalData) => {
    try {
      if (editingGoal) {
        await nutritionService.updateGoal(editingGoal._id, goalData)
      } else {
        await nutritionService.createGoal(goalData)
      }
      await loadGoals()
      setShowModal(false)
      setEditingGoal(null)
    } catch (error) {
      console.error('Error saving goal:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await nutritionService.deleteGoal(id)
        await loadGoals()
      } catch (error) {
        console.error('Error deleting goal:', error)
      }
    }
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

  const categoryGradients = {
    fitness: 'from-blue-500 to-cyan-500',
    nutrition: 'from-green-500 to-emerald-500',
    wellness: 'from-purple-500 to-pink-500',
    sleep: 'from-indigo-500 to-blue-500'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Target className="text-purple-600" size={32} />
            <span>Your Goals ({goals.length})</span>
          </h1>
          <p className="text-gray-600 mt-2">Track and achieve your fitness objectives</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus size={20} />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const gradient = categoryGradients[goal.category] || 'from-gray-500 to-gray-600'
          return (
            <div key={goal._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradient}`}></div>
              
              <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">{goal.title}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${gradient} text-white`}>
                    {goal.category}
                  </span>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditingGoal(goal)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{goal.currentValue}</p>
                    <p className="text-sm text-gray-600">Current</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{goal.targetValue}</p>
                    <p className="text-sm text-gray-600">Target</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded-full bg-gradient-to-r ${gradient} text-white`}>
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {goal.targetDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}

                {goal.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{goal.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <Target size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-gray-600">No goals yet. Start setting your fitness targets!</p>
        </div>
      )}

      {/* Success Tips */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <Award size={28} />
          <span>Success Tips</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-lg mb-2">Start Small</h4>
            <p className="text-sm text-blue-50">Break big goals into smaller, manageable milestones</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-lg mb-2">Stay Consistent</h4>
            <p className="text-sm text-blue-50">Regular effort leads to big results over time</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-lg mb-2">Track Progress</h4>
            <p className="text-sm text-blue-50">What gets measured gets managed and improved</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-lg mb-2">Celebrate Wins</h4>
            <p className="text-sm text-blue-50">Acknowledge every success, no matter how small</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingGoal(null)
        }}
        title={editingGoal ? 'Edit Goal' : 'Add Goal'}
      >
        <GoalForm
          goal={editingGoal}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false)
            setEditingGoal(null)
          }}
        />
      </FormModal>
    </div>
  )
}

function GoalForm({ goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'fitness',
    targetMetric: goal?.targetMetric || '',
    targetValue: goal?.targetValue || 0,
    currentValue: goal?.currentValue || 0,
    targetDate: goal?.targetDate ? format(new Date(goal.targetDate), 'yyyy-MM-dd') : ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Run 5K without stopping"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="fitness">Fitness</option>
            <option value="nutrition">Nutrition</option>
            <option value="wellness">Wellness</option>
            <option value="sleep">Sleep</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target Metric</label>
          <input
            type="text"
            value={formData.targetMetric}
            onChange={(e) => setFormData(prev => ({ ...prev, targetMetric: e.target.value }))}
            placeholder="e.g., kg, minutes, steps"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Value</label>
          <input
            type="number"
            value={formData.currentValue}
            onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target Value</label>
          <input
            type="number"
            value={formData.targetValue}
            onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
        <input
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
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
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {goal ? 'Update' : 'Create'} Goal
        </button>
      </div>
    </form>
  )
}

export default Goals