import React, { useState, useEffect } from 'react'
import { activityService, nutritionService } from '../services/api'
import ProgressChart from '../components/ProgressChart'
import { format, subDays, eachDayOfInterval } from 'date-fns'

function Progress() {
  const [activities, setActivities] = useState([])
  const [goals, setGoals] = useState([])
  const [dateRange, setDateRange] = useState('week')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      const [activitiesRes, goalsRes] = await Promise.all([
        activityService.getAll(),
        nutritionService.getGoals()
      ])
      
      setActivities(activitiesRes.data)
      setGoals(goalsRes.data)
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate chart data based on date range
  const getChartData = () => {
    const endDate = new Date()
    const startDate = subDays(endDate, dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 7)
    
    const dateRangeArray = eachDayOfInterval({ start: startDate, end: endDate })
    
    return dateRangeArray.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayActivities = activities.filter(activity => 
        format(new Date(activity.date), 'yyyy-MM-dd') === dateStr
      )
      
      return {
        date: format(date, 'MMM dd'),
        calories: dayActivities.reduce((sum, activity) => sum + activity.calories, 0),
        minutes: dayActivities.reduce((sum, activity) => sum + activity.duration, 0),
        activities: dayActivities.length
      }
    })
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Calories,Minutes,Activities\n"
      + getChartData().map(row => 
          `${row.date},${row.calories},${row.minutes},${row.activities}`
        ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `fitness-progress-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  const chartData = getChartData()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Progress Analytics</h1>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button
            onClick={handleExport}
            className="btn-primary"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart
          data={chartData}
          dataKey="calories"
          title="Calories Burned"
        />
        
        <ProgressChart
          data={chartData}
          dataKey="minutes"
          title="Active Minutes"
        />
        
        <ProgressChart
          data={chartData}
          dataKey="activities"
          title="Workout Sessions"
        />
      </div>

      {/* Goals Progress Summary */}
      <section className="metric-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Goals Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.slice(0, 6).map((goal) => (
            <div key={goal._id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{goal.title}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span className="font-medium">{Math.round(goal.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{goal.currentValue} {goal.targetMetric}</span>
                  <span>{goal.targetValue} {goal.targetMetric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="metric-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">465</div>
            <div className="text-sm text-gray-600">Calories Burned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">66</div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Progress