// components/ui/GameHeader.jsx
import React from 'react'
import Button from './Button'

const GameHeader = ({ title, subtitle, onBack, children }) => (
  <div className="flex justify-between items-center mb-8 rounded-lg p-4 border border-gray-700">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-gray-300">{subtitle}</p>}
      {children}
    </div>
    <Button variant="danger" onClick={onBack}>
      Back to Menu
    </Button>
  </div>
)

export default GameHeader
