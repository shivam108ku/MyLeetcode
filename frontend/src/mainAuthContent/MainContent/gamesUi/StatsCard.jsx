// components/ui/StatsCard.jsx
import React from 'react'

const StatsCard = ({ label, value, color = 'blue' }) => {
  const colorClasses = {
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400'
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

export default StatsCard
