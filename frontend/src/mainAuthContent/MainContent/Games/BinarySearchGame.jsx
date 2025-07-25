// components/games/BinarySearchGame.jsx
import React from 'react'
import GameHeader from '../gamesUi/GameHeader'
import Button from '../gamesUi/Button'

const BinarySearchGame = ({ gameState, searchGame, setSearchGame, updateGameState, backToMenu }) => {
  const binarySearchGuess = (index) => {
    const { array, target, attempts, maxAttempts } = searchGame
    const guess = array[index]
    const newAttempts = attempts + 1
    
    if (guess === target) {
      const bonusPoints = Math.max(300 - newAttempts * 30, 100)
      setSearchGame(prev => ({
        ...prev,
        found: true,
        attempts: newAttempts,
        currentGuess: index
      }))
      
      updateGameState({
        score: gameState.score + bonusPoints,
        bestScores: {
          ...gameState.bestScores,
          search: Math.max(gameState.bestScores.search, bonusPoints)
        }
      })
    } else if (newAttempts >= maxAttempts) {
      updateGameState({ lives: gameState.lives - 1 })
      initSearchGame()
    } else {
      const newLow = guess < target ? index + 1 : searchGame.low
      const newHigh = guess > target ? index - 1 : searchGame.high
      
      setSearchGame(prev => ({
        ...prev,
        low: newLow,
        high: newHigh,
        attempts: newAttempts,
        currentGuess: index
      }))
    }
  }

  const initSearchGame = () => {
    const size = 8 + gameState.level * 2
    const arr = Array.from({ length: size }, (_, i) => (i + 1) * 2)
    const target = arr[Math.floor(Math.random() * arr.length)]
    const maxAttempts = Math.ceil(Math.log2(size)) + 1
    
    setSearchGame({
      array: arr,
      target,
      low: 0,
      high: arr.length - 1,
      attempts: 0,
      found: false,
      currentGuess: -1,
      maxAttempts
    })
  }

  return (
    <div className="min-h-screen mx-auto w-[93%] ml-[12vh] p-4">
      <GameHeader
        title="Binary Search Challenge"
        onBack={backToMenu}
      >
        <p className="text-gray-300">
          Target: <span className="text-yellow-400 font-bold">{searchGame.target}</span> | 
          Attempts: <span className="text-red-400 font-bold">{searchGame.attempts}/{searchGame.maxAttempts}</span>
        </p>
      </GameHeader>

      {/* Instructions */}
      <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 mb-8 backdrop-blur-lg">
        <p className="text-purple-200 text-center">
          🎯 Find the target number using binary search! Click on elements to guess.
        </p>
        <p className="text-gray-300 text-center mt-2 text-sm">
          Valid range: index <span className="text-green-400">{searchGame.low}</span> to <span className="text-green-400">{searchGame.high}</span>
        </p>
      </div>

      {/* Search Array */}
      <SearchArrayDisplay
        array={searchGame.array}
        searchGame={searchGame}
        onGuess={binarySearchGuess}
      />

      {/* Success Message */}
      {searchGame.found && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center backdrop-blur-lg mb-8">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">Target Found!</h3>
          <p className="text-green-200 mb-4">Found in {searchGame.attempts} attempts!</p>
          <Button variant="success" onClick={initSearchGame}>
            Next Challenge
          </Button>
        </div>
      )}

      {/* Strategy Hint */}
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-lg">
        <p className="text-yellow-200 text-center">
          💡 <strong>Binary Search Strategy:</strong> Always guess the middle element of the valid range!
          <br />
          <span className="text-sm text-gray-300 mt-2 block">
            If your guess is too high, search the left half. If too low, search the right half.
          </span>
        </p>
      </div>
    </div>
  )
}

const SearchArrayDisplay = ({ array, searchGame, onGuess }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-white mb-4 text-center">Sorted Array</h3>
    <div className="flex flex-wrap justify-center gap-2">
      {array.map((value, index) => {
        let bgClass = 'from-gray-600 to-gray-700'
        let textClass = 'text-gray-300'
        let cursorClass = 'cursor-not-allowed'
        let borderClass = 'border-gray-600'
        
        if (index < searchGame.low || index > searchGame.high) {
          bgClass = 'from-red-600 to-red-700'
          textClass = 'text-red-200'
          borderClass = 'border-red-500'
        } else if (index === searchGame.currentGuess) {
          if (searchGame.found) {
            bgClass = 'from-green-500 to-emerald-500'
            textClass = 'text-white'
            borderClass = 'border-green-400'
          } else {
            bgClass = 'from-yellow-500 to-orange-500'
            textClass = 'text-white'
            borderClass = 'border-yellow-400'
          }
        } else if (index >= searchGame.low && index <= searchGame.high) {
          bgClass = 'from-blue-500 to-cyan-500 hover:from-blue-400 hover-to-cyan-400'
          textClass = 'text-white'
          cursorClass = 'cursor-pointer hover:scale-105'
          borderClass = 'border-blue-400'
        }

        return (
          <div
            key={index}
            onClick={() => {
              if (index >= searchGame.low && index <= searchGame.high && !searchGame.found) {
                onGuess(index)
              }
            }}
            className={`
              relative w-14 h-14 flex items-center justify-center rounded-lg 
              bg-gradient-to-r ${bgClass} ${textClass} ${cursorClass}
              font-bold text-sm transition-all duration-300 
              border-2 ${borderClass}
            `}
          >
            {value}
            <div className="absolute -bottom-6 text-gray-400 text-xs">
              [{index}]
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

export default BinarySearchGame
