// components/ui/GameMenu.jsx
import React from 'react'
import StatsCard from './StatsCard'
import Button from './Button'
import { CircleDot } from 'lucide-react';

const GameMenu = ({ gameState, startGame }) => {
  const games = [
    {
      id: 'array',
      title: 'Array Sorting',
      icon: '﹝﹞',
      description: 'Master sorting algorithms with visual swapping',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner'
    },
    {
      id: 'stack',
      title: 'Stack & Queue',
      icon: '⊎',
      description: 'Learn LIFO and FIFO operations interactively',
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Intermediate'
    },
    {
      id: 'search',
      title: 'Binary Search',
      icon: '⍥',
      description: 'Master the art of efficient searching',
      color: 'from-purple-500 to-violet-500',
      difficulty: 'Intermediate'
    },
    {
      id: 'tree',
      title: 'Binary Trees',
      icon: '〶',
      description: 'Navigate and manipulate tree structures',
      color: 'from-orange-500 to-red-500',
      difficulty: 'Advanced'
    }
  ]

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center">
         
        <p className="text-gray-300 text-sm md:text-xl font-bold mb-8">
          Master Data Structures & Algorithms through Interactive Gaming
        </p>
        
        {/* Stats Dashboard */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <StatsCard label="Total Score" value={gameState.score} color="yellow" />
          <StatsCard label="Level" value={gameState.level} color="green" />
          <StatsCard label="Lives" value={'❤️'.repeat(gameState.lives)} color="red" />
          <StatsCard label="Achievements" value={gameState.achievements.length} color="purple" />
        </div>
      </div>

      {/* Game Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index}
            bestScore={gameState.bestScores[game.id]}
            onStart={() => startGame(game.id)}
          />
        ))}
      </div>

      {/* Recent Achievements */}
      {gameState.achievements.length > 0 && (
        <AchievementsSection achievements={gameState.achievements} />
      )}
    </div>
  )
}

const GameCard = ({ game, index, bestScore, onStart }) => (
  <div
    onClick={onStart}
    className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
  >
    <div className={`absolute ${game.color} rounded-xl`} />
    <div className="relative rounded-b-3xl p-6 border border-green-800">
      <div className="text-4xl mb-4 text-center animate-bounce">{game.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
      <p className="text-gray-300 text-sm mb-4">{game.description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${game.color} text-white`}>
          {game.difficulty}
        </span>
        <div className="text-yellow-400 text-sm">
          Best: {bestScore}
        </div>
      </div>
    </div>
  </div>
)

const AchievementsSection = ({ achievements }) => (
  <div className="mt-12 w-full max-w-4xl">
    <h3 className="text-2xl font-bold text-white mb-4 text-center">Recent Achievements</h3>
    <div className="flex flex-wrap justify-center gap-4">
      {achievements.slice(-3).map((achievement, index) => (
        <div key={index} className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-lg">
          <div className="text-yellow-400 font-semibold text-sm">{achievement.title}</div>
          <div className="text-gray-300 text-xs">{achievement.description}</div>
        </div>
      ))}
    </div>
  </div>
)

export default GameMenu
