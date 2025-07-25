// hooks/useGameState.js
import { useState, useCallback } from 'react'

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    currentGame: null,
    score: 0,
    level: 1,
    lives: 3,
    isPlaying: false,
    showMenu: true,
    achievements: [],
    bestScores: {
      array: 0,
      stack: 0,
      search: 0,
      tree: 0
    }
  })

  const [arrayGame, setArrayGame] = useState({
    array: [],
    targetArray: [],
    moves: 0,
    isComplete: false,
    selectedIndex: -1,
    hint: ''
  })

  const [stackGame, setStackGame] = useState({
    stack: [],
    queue: [],
    targetSequence: [],
    currentInput: '',
    operations: [],
    challenge: 'Create sequence using stack/queue operations'
  })

  const [searchGame, setSearchGame] = useState({
    array: [],
    target: 0,
    low: 0,
    high: 0,
    attempts: 0,
    found: false,
    currentGuess: -1,
    maxAttempts: 0
  })

  const [treeGame, setTreeGame] = useState({
    nodes: [],
    currentOperation: 'insert',
    selectedNode: null,
    traversalResult: [],
    targetTraversal: []
  })

  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }))
  }, [])

  const startGame = useCallback((gameType) => {
    setGameState(prev => ({
      ...prev,
      currentGame: gameType,
      showMenu: false,
      isPlaying: true
    }))

    // Initialize specific game
    switch (gameType) {
      case 'array':
        initArrayGame()
        break
      case 'stack':
        initStackGame()
        break
      case 'search':
        initSearchGame()
        break
      case 'tree':
        initTreeGame()
        break
    }
  }, [gameState.level])

  const backToMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentGame: null,
      showMenu: true,
      isPlaying: false
    }))
  }, [])

  const initArrayGame = useCallback(() => {
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
  }, [gameState.level])

  const initStackGame = useCallback(() => {
    const sequences = [[1, 2, 3], [3, 2, 1], [1, 3, 2], [2, 1, 3]]
    const targetSequence = sequences[Math.floor(Math.random() * sequences.length)]
    
    setStackGame({
      stack: [],
      queue: [],
      targetSequence,
      currentInput: '',
      operations: [],
      challenge: `Create sequence: [${targetSequence.join(', ')}]`
    })
  }, [])

  const initSearchGame = useCallback(() => {
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
  }, [gameState.level])

  const initTreeGame = useCallback(() => {
    const values = [50, 30, 70, 20, 40, 60, 80]
    setTreeGame({
      nodes: values.slice(0, 4 + gameState.level),
      currentOperation: 'insert',
      selectedNode: null,
      traversalResult: [],
      targetTraversal: [20, 30, 40, 50]
    })
  }, [gameState.level])

  return {
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
  }
}
