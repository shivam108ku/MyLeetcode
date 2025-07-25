// MultiLanguageCodeVisualizer.jsx
import React from 'react'
import { useGameState } from '../gameHooks/useGameState'
import GameMenu from '../gamesUi/GameMenu'
import ArraySortingGame from '../Games/ArraySortingGame'
import StackQueueGame from '../Games/StackQueueGame'
import BinarySearchGame from '../Games/BinarySearchGame'
import TreeGame from '../Games/TreeGame'

const DsaArena = () => {
  const {
    gameState,
    arrayGame,
    stackGame,
    searchGame,
    treeGame,
    startGame,
    backToMenu,
    updateGameState,
    setArrayGame,
    setStackGame,
    setSearchGame,
    setTreeGame
  } = useGameState()

  const renderGame = () => {
    if (gameState.showMenu) return <GameMenu gameState={gameState} startGame={startGame} />
    
    switch (gameState.currentGame) {
      case 'array':
        return <ArraySortingGame 
          gameState={gameState}
          arrayGame={arrayGame}
          setArrayGame={setArrayGame}
          updateGameState={updateGameState}
          backToMenu={backToMenu}
        />
      case 'stack':
        return <StackQueueGame 
          gameState={gameState}
          stackGame={stackGame}
          setStackGame={setStackGame}
          updateGameState={updateGameState}
          backToMenu={backToMenu}
        />
      case 'search':
        return <BinarySearchGame 
          gameState={gameState}
          searchGame={searchGame}
          setSearchGame={setSearchGame}
          updateGameState={updateGameState}
          backToMenu={backToMenu}
        />
      case 'tree':
        return <TreeGame 
          gameState={gameState}
          treeGame={treeGame}
          setTreeGame={setTreeGame}
          updateGameState={updateGameState}
          backToMenu={backToMenu}
        />
      default:
        return <GameMenu gameState={gameState} startGame={startGame} />
    }
  }

  return <div className="font-sans min-h-screen">{renderGame()}</div>
}

export default DsaArena
