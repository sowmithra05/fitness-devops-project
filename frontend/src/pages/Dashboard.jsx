import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Flame, Clock, Droplets, TrendingUp, Dumbbell, Apple, Target, BarChart3, Zap, Award } from 'lucide-react'
import { activityService, nutritionService } from '../services/api'
import { format } from 'date-fns'

function Dashboard() {
  const [activities, setActivities] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [activitiesRes, goalsRes] = await Promise.all([
        activityService.getAll(),
        nutritionService.getGoals()
      ])
      
      setActivities(activitiesRes.data)
      setGoals(goalsRes.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayActivities = activities.filter(activity => 
    format(new Date(activity.date), 'yyyy-MM-dd') === today
  )

  const totalSteps = todayActivities.reduce((sum, activity) => {
    if (activity.type === 'walking' || activity.type === 'running') {
      return sum + (activity.distance * 1400)
    }
    return sum
  }, 8432)

  const totalCalories = todayActivities.reduce((sum, activity) => sum + activity.calories, 420)
  const totalMinutes = todayActivities.reduce((sum, activity) => sum + activity.duration, 45)

  const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).firstName : 'User'

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
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-8 py-12 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <Award className="text-yellow-300 animate-pulse" size={32} />
            <h1 className="text-4xl font-bold">Good evening, {userName}! 👋</h1>
          </div>
          <p className="text-xl text-blue-100 font-light">Ready to crush your fitness goals today?</p>
        </div>
      </div>

      {/* Goals Progress Cards */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Today's Progress</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Steps"
            value="8,432"
            progress={8432}
            target={10000}
            subtitle="Today: +12%"
            icon={<Activity className="text-blue-500" size={28} />}
            gradient="from-blue-500 to-cyan-500"
            trend="up"
          />
          
          <MetricCard
            title="Calories"
            value="420 cal"
            progress={420}
            target={500}
            subtitle="Burned: +8%"
            icon={<Flame className="text-orange-500" size={28} />}
            gradient="from-orange-500 to-red-500"
            trend="up"
          />
          
          <MetricCard
            title="Active Minutes"
            value="45 min"
            progress={45}
            target={60}
            subtitle="Today: -5%"
            icon={<Clock className="text-purple-500" size={28} />}
            gradient="from-purple-500 to-pink-500"
            trend="down"
          />
          
          <MetricCard
            title="Water"
            value="6 glasses"
            progress={6}
            target={8}
            subtitle="75% complete"
            icon={<Droplets className="text-blue-400" size={28} />}
            gradient="from-blue-400 to-blue-600"
            trend="neutral"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="text-yellow-500" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Log Workout"
            description="Record your latest exercise session"
            icon={<Dumbbell size={32} />}
            path="/activities"
            gradient="from-blue-500 to-blue-600"
          />
          
          <QuickActionCard
            title="Track Nutrition"
            description="Log your meals and water intake"
            icon={<Apple size={32} />}
            path="/nutrition"
            gradient="from-green-500 to-emerald-600"
          />
          
          <QuickActionCard
            title="View Progress"
            description="Analyze your fitness trends"
            icon={<BarChart3 size={32} />}
            path="/progress"
            gradient="from-purple-500 to-purple-600"
          />
          
          <QuickActionCard
            title="Set New Goal"
            description="Create and manage your objectives"
            icon={<Target size={32} />}
            path="/goals"
            gradient="from-pink-500 to-rose-600"
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="text-green-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {activities.slice(0, 3).length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 3).map((activity, index) => (
                <div 
                  key={activity._id} 
                  className={`flex justify-between items-center py-4 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200 ${
                    index !== 2 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {activity.type.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{activity.type}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {activity.duration} min
                        </span>
                        <span className="text-sm text-gray-600 flex items-center">
                          <Flame size={14} className="mr-1" />
                          {activity.calories} cal
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {format(new Date(activity.date), 'MMM dd')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mx-auto mb-3 opacity-30" />
              <p>No recent activities. Start logging your workouts!</p>
            </div>
          )}
        </div>
      </section>

      {/* Daily Motivation */}
      <section>
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-24 -mt-24"></div>
          
          <div className="relative z-10 flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white leading-relaxed mb-2">
                "Small consistent actions lead to big results."
              </p>
              <p className="text-blue-100 font-medium">— Health Expert</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ title, value, progress, target, subtitle, icon, gradient, trend }) {
  const progressPercentage = (progress / target) * 100

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <p className={`text-sm font-medium mt-1 flex items-center ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && <TrendingUp size={14} className="mr-1" />}
                {subtitle}
              </p>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white`}>
              {progress}/{target}
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 shadow-lg`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 text-right font-medium">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, path, gradient }) {
  return (
    <Link
      to={path}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          {icon}
        </div>
        
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-600 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default Dashboard