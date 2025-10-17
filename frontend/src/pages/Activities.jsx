import React, { useState, useEffect } from 'react'
import { activityService } from '../services/api'
import FormModal from '../components/FormModal'
import { format } from 'date-fns'
import { Activity, Plus, Edit2, Trash2, Clock, Flame, TrendingUp, Zap } from 'lucide-react'

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const response = await activityService.getAll()
      setActivities(response.data)
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (activityData) => {
    try {
      if (editingActivity) {
        await activityService.update(editingActivity._id, activityData)
      } else {
        await activityService.create(activityData)
      }
      await loadActivities()
      setShowModal(false)
      setEditingActivity(null)
    } catch (error) {
      console.error('Error saving activity:', error)
    }
  }

  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.delete(id)
        await loadActivities()
      } catch (error) {
        console.error('Error deleting activity:', error)
      }
    }
  }

  const activityTypes = [
    { name: 'Running', icon: '🏃', color: 'from-red-500 to-orange-500' },
    { name: 'Cycling', icon: '🚴', color: 'from-blue-500 to-cyan-500' },
    { name: 'Strength Training', icon: '💪', color: 'from-purple-500 to-pink-500' },
    { name: 'Yoga', icon: '🧘', color: 'from-green-500 to-emerald-500' },
    { name: 'Swimming', icon: '🏊', color: 'from-blue-400 to-blue-600' },
    { name: 'Walking', icon: '🚶', color: 'from-gray-500 to-gray-600' },
    { name: 'HIIT', icon: '⚡', color: 'from-yellow-500 to-orange-600' },
    { name: 'Pilates', icon: '🤸', color: 'from-pink-500 to-rose-600' }
  ]

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Activity className="text-blue-600" size={32} />
            <span>Activities</span>
          </h1>
          <p className="text-gray-600 mt-2">Track and manage your workouts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus size={20} />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Quick Add Templates */}
      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Zap className="text-yellow-500" size={24} />
          <span>Quick Add Templates</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {activityTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => handleSubmit({
                type: type.name,
                duration: 30,
                calories: 300,
                date: new Date(),
                intensity: 'Moderate'
              })}
              className="group relative p-4 border-2 border-gray-200 rounded-xl text-center hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <div className="font-semibold text-gray-900 text-sm group-hover:text-white transition-colors duration-300">
                  {type.name}
                </div>
                <div className="text-xs text-gray-600 mt-1 group-hover:text-white transition-colors duration-300">
                  30 min • 300 cal
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Activities List */}
      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="text-green-600" size={24} />
          <span>Recent Activities ({activities.length})</span>
        </h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="group flex justify-between items-center p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {activity.type.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{activity.type}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {activity.duration} min
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Flame size={14} className="mr-1" />
                      {activity.calories} cal
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {activity.intensity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(activity.date), 'MMM dd, yyyy • hh:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(activity)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(activity._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Activity size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No activities yet. Start tracking your workouts!</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingActivity(null)
        }}
        title={editingActivity ? 'Edit Activity' : 'Add Activity'}
      >
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false)
            setEditingActivity(null)
          }}
        />
      </FormModal>
    </div>
  )
}

function ActivityForm({ activity, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: activity?.type || 'Running',
    duration: activity?.duration || 30,
    calories: activity?.calories || 300,
    distance: activity?.distance || 0,
    date: activity?.date ? format(new Date(activity.date), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    intensity: activity?.intensity || 'Moderate',
    notes: activity?.notes || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option>Running</option>
          <option>Cycling</option>
          <option>Strength Training</option>
          <option>Yoga</option>
          <option>Swimming</option>
          <option>Walking</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
          <input
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Distance (km)</label>
        <input
          type="number"
          step="0.1"
          value={formData.distance}
          onChange={(e) => setFormData(prev => ({ ...prev, distance: parseFloat(e.target.value) }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Intensity</label>
        <select
          value={formData.intensity}
          onChange={(e) => setFormData(prev => ({ ...prev, intensity: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {activity ? 'Update' : 'Create'} Activity
        </button>
      </div>
    </form>
  )
}

export default Activities