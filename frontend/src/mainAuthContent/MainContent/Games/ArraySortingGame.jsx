// components/games/ArraySortingGame.jsx
import React from 'react'
import GameHeader from '../gamesUi/GameHeader'
import Button from '../gamesUi/Button'

const ArraySortingGame = ({ gameState, arrayGame, setArrayGame, updateGameState, backToMenu }) => {
  const swapArrayElements = (index1, index2) => {
    if (index1 === index2) return
    
    const newArray = [...arrayGame.array]
    ;[newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]]
    
    const moves = arrayGame.moves + 1
    const isComplete = JSON.stringify(newArray) === JSON.stringify(arrayGame.targetArray)
    
    setArrayGame(prev => ({
      ...prev,
      array: newArray,
      moves,
      isComplete,
      selectedIndex: -1
    }))

    if (isComplete) {
      const bonusPoints = Math.max(200 - moves * 10, 50)
      updateGameState({
        score: gameState.score + bonusPoints,
        level: gameState.level + 1,
        bestScores: {
          ...gameState.bestScores,
          array: Math.max(gameState.bestScores.array, bonusPoints)
        }
      })
    }
  }

  const initArrayGame = () => {
    const size = Math.min(4 + gameState.level, 10)
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1)
    const target = [...arr].sort((a, b) => a - b)
    
    setArrayGame({
      array: arr,
      targetArray: target,
      moves: 0,
      isComplete: false,
      selectedIndex: -1,
      hint: size > 6 ? 'Try bubble sort approach!' : 'Find the smallest numbers first!'
    })
  }

  return (
    <div className="min-h-screen mx-auto w-[93%] ml-[13vh] p-4">
      <GameHeader
        title="Array Sorting Challenge"
        subtitle={`Level ${gameState.level} • Moves: ${arrayGame.moves}`}
        onBack={backToMenu}
      />

      {/* Instructions */}
      <InstructionPanel hint={arrayGame.hint} />

      {/* Current Array */}
      <ArrayDisplay
        title="Current Array"
        array={arrayGame.array}
        selectedIndex={arrayGame.selectedIndex}
        onElementClick={(index) => {
          if (arrayGame.selectedIndex === -1) {
            setArrayGame(prev => ({ ...prev, selectedIndex: index }))
          } else if (arrayGame.selectedIndex === index) {
            setArrayGame(prev => ({ ...prev, selectedIndex: -1 }))
          } else {
            swapArrayElements(arrayGame.selectedIndex, index)
          }
        }}
      />

      {/* Target Array */}
      <ArrayDisplay
        title="Target (Sorted)"
        array={arrayGame.targetArray}
        isTarget={true}
      />

      {/* Success Message */}
      {arrayGame.isComplete && (
        <SuccessPanel
          message={`Array sorted in ${arrayGame.moves} moves!`}
          onNext={initArrayGame}
        />
      )}
    </div>
  )
}

const InstructionPanel = ({ hint }) => (
  <div className=" rounded-lg p-4 mb-8 backdrop-blur-lg">
    <p className="text-blue-200 text-2xl font-black text-center">
       Click two numbers to swap them and sort the array in ascending order!
    </p>
    {hint && (
      <p className="text-yellow-300 text-center mt-2 text-sm">
        💡 Hint: {hint}
      </p>
    )}
  </div>
)

const ArrayDisplay = ({ title, array, selectedIndex = -1, onElementClick, isTarget = false }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-white mb-4 text-center">{title}</h3>
    <div className="flex flex-wrap justify-center gap-3">
      {array.map((value, index) => (
        <ArrayElement
          key={index}
          value={value}
          index={index}
          isSelected={selectedIndex === index}
          isTarget={isTarget}
          onClick={() => onElementClick && onElementClick(index)}
        />
      ))}
    </div>
  </div>
)

const ArrayElement = ({ value, index, isSelected, isTarget, onClick }) => {
  let className = 'relative w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg border-2 border-white/20 text-white transition-all duration-300'
  
  if (isTarget) {
    className += ' bg-gradient-to-r from-green-500 to-emerald-500'
  } else if (isSelected) {
    className += ' bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-red-500/50 scale-110 animate-pulse cursor-pointer'
  } else {
    className += ' bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 cursor-pointer hover:scale-110'
  }

  return (
    <div className={className} onClick={onClick}>
      {value}
      <div className="absolute -bottom-6 text-gray-400 text-xs">
        [{index}]
      </div>
    </div>
  )
}

const SuccessPanel = ({ message, onNext }) => (
  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center backdrop-blur-lg">
    <div className="text-4xl mb-4">🎉</div>
    <h3 className="text-2xl font-bold text-green-400 mb-2">Congratulations!</h3>
    <p className="text-green-200 mb-4">{message}</p>
    <Button variant="success" onClick={onNext}>
      Next Level
    </Button>
  </div>
)

export default ArraySortingGame
