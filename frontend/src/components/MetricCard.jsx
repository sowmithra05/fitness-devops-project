import React from 'react'

function MetricCard({ title, value, progress, target, subtitle, icon }) {
  const progressPercentage = progress ? (progress / target) * 100 : 0

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          {progress !== undefined && target && (
            <span className="text-sm font-medium text-blue-600">
              {progress}/{target}
            </span>
          )}
        </div>

        {progress !== undefined && target && (
          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="progress-bar bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 text-right">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard