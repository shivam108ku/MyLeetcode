// utils/gameLogic.js

/**
 * Array manipulation utilities
 */
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const generateRandomArray = (size, min = 1, max = 99) => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

export const isSorted = (array, ascending = true) => {
  for (let i = 1; i < array.length; i++) {
    if (ascending ? array[i] < array[i - 1] : array[i] > array[i - 1]) {
      return false
    }
  }
  return true
}

export const getMinimumSwaps = (array, target) => {
  const n = array.length
  let swaps = 0
  const arr = [...array]
  const targetMap = new Map()
  
  target.forEach((val, idx) => targetMap.set(val, idx))
  
  for (let i = 0; i < n; i++) {
    if (arr[i] !== target[i]) {
      const targetIndex = targetMap.get(target[i])
      const currentIndex = arr.findIndex((val, idx) => idx > i && val === target[i])
      
      if (currentIndex !== -1) {
        ;[arr[i], arr[currentIndex]] = [arr[currentIndex], arr[i]]
        swaps++
      }
    }
  }
  
  return swaps
}

/**
 * Scoring system
 */
export const calculateArrayScore = (moves, optimalMoves, level, timeBonus = 0) => {
  const baseScore = 100
  const efficiency = Math.max(0.1, optimalMoves / moves)
  const levelMultiplier = 1 + (level - 1) * 0.2
  
  return Math.round(baseScore * efficiency * levelMultiplier + timeBonus)
}

export const calculateSearchScore = (attempts, optimalAttempts, level) => {
  const baseScore = 200
  const efficiency = Math.max(0.1, optimalAttempts / attempts)
  const levelMultiplier = 1 + (level - 1) * 0.3
  
  return Math.round(baseScore * efficiency * levelMultiplier)
}

export const calculateStackQueueScore = (operations, targetLength, level) => {
  const baseScore = 150
  const efficiency = Math.max(0.1, targetLength / operations)
  const levelMultiplier = 1 + (level - 1) * 0.25
  
  return Math.round(baseScore * efficiency * levelMultiplier)
}

/**
 * Binary Search utilities
 */
export const binarySearchOptimalSteps = (arrayLength) => {
  return Math.ceil(Math.log2(arrayLength))
}

export const getBinarySearchHint = (guess, target, low, high) => {
  if (guess === target) return "🎯 Target found!"
  if (guess < target) return "📈 Target is higher! Search right half."
  return "📉 Target is lower! Search left half."
}

export const getOptimalBinarySearchPath = (array, target) => {
  const path = []
  let low = 0
  let high = array.length - 1
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    path.push(mid)
    
    if (array[mid] === target) break
    
    if (array[mid] < target) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  
  return path
}

/**
 * Stack and Queue utilities
 */
export const generateStackSequence = (length = 5) => {
  const sequences = [
    [1, 2, 3],
    [3, 2, 1],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [1, 2, 3, 4],
    [4, 3, 2, 1],
    [2, 1, 4, 3]
  ]
  
  return sequences[Math.floor(Math.random() * sequences.length)]
}

export const validateStackSequence = (operations, targetSequence) => {
  const stack = []
  const result = []
  let targetIndex = 0
  
  for (const op of operations) {
    if (op.type === 'push') {
      stack.push(op.value)
    } else if (op.type === 'pop' && stack.length > 0) {
      result.push(stack.pop())
    }
  }
  
  return JSON.stringify(result) === JSON.stringify(targetSequence)
}

export const canGenerateSequence = (input, targetSequence) => {
  const stack = []
  let inputIndex = 0
  let targetIndex = 0
  
  while (targetIndex < targetSeque.length) {
    if (stack.length > 0 && stack[stack.length - 1] === targetSequence[targetIndex]) {
      stack.pop()
      targetIndex++
    } else if (inputIndex < input.length) {
      stack.push(input[inputIndex])
      inputIndex++
    } else {
      return false
    }
  }
  
  return true
}

/**
 * Binary Tree utilities
 */
export const createBinaryTree = (values) => {
  if (!values.length) return null
  
  const nodes = new Map()
  values.forEach(val => {
    nodes.set(val, { value: val, left: null, right: null })
  })
  
  // Simple BST construction
  const root = nodes.get(values[0])
  
  for (let i = 1; i < values.length; i++) {
    insertIntoBST(root, values[i], nodes)
  }
  
  return { root, nodes }
}

const insertIntoBST = (root, value, nodes) => {
  if (value < root.value) {
    if (!root.left) {
      root.left = nodes.get(value)
    } else {
      insertIntoBST(root.left, value, nodes)
    }
  } else {
    if (!root.right) {
      root.right = nodes.get(value)
    } else {
      insertIntoBST(root.right, value, nodes)
    }
  }
}

export const inorderTraversal = (root) => {
  const result = []
  
  const traverse = (node) => {
    if (!node) return
    traverse(node.left)
    result.push(node.value)
    traverse(node.right)
  }
  
  traverse(root)
  return result
}

export const preorderTraversal = (root) => {
  const result = []
  
  const traverse = (node) => {
    if (!node) return
    result.push(node.value)
    traverse(node.left)
    traverse(node.right)
  }
  
  traverse(root)
  return result
}

export const postorderTraversal = (root) => {
  const result = []
  
  const traverse = (node) => {
    if (!node) return
    traverse(node.left)
    traverse(node.right)
    result.push(node.value)
  }
  
  traverse(root)
  return result
}

/**
 * Achievement system
 */
export const checkAchievements = (gameStats) => {
  const achievements = []
  
  // Array sorting achievements
  if (gameStats.arrayMoves <= gameStats.arraySize) {
    achievements.push({
      id: 'perfect_sort',
      title: 'Perfect Sorter',
      description: 'Sorted array in minimum moves!',
      icon: '🏆',
      points: 100
    })
  }
  
  // Binary search achievements
  if (gameStats.searchAttempts <= Math.ceil(Math.log2(gameStats.arraySize))) {
    achievements.push({
      id: 'search_master',
      title: 'Search Master',
      description: 'Found target in optimal steps!',
      icon: '🎯',
      points: 150
    })
  }
  
  // Streak achievements
  if (gameStats.currentStreak >= 5) {
    achievements.push({
      id: 'streak_5',
      title: 'On Fire!',
      description: '5 game winning streak!',
      icon: '🔥',
      points: 200
    })
  }
  
  // Level achievements
  if (gameStats.level >= 10) {
    achievements.push({
      id: 'level_10',
      title: 'Veteran Player',
      description: 'Reached level 10!',
      icon: '⭐',
      points: 300
    })
  }
  
  return achievements
}

/**
 * Difficulty scaling
 */
export const getDifficultySettings = (level) => {
  return {
    arraySize: Math.min(4 + level, 12),
    searchArraySize: Math.min(8 + level * 2, 20),
    stackQueueComplexity: Math.min(3 + Math.floor(level / 2), 8),
    treeDepth: Math.min(3 + Math.floor(level / 3), 6),
    timeLimit: Math.max(120 - level * 5, 30), // seconds
    livesReduction: level > 5 ? 1 : 0
  }
}

/**
 * Game state persistence
 */
export const saveGameProgress = (gameState) => {
  try {
    localStorage.setItem('dsa-game-progress', JSON.stringify({
      ...gameState,
      lastPlayed: new Date().toISOString()
    }))
    return true
  } catch (error) {
    console.error('Failed to save game progress:', error)
    return false
  }
}

export const loadGameProgress = () => {
  try {
    const saved = localStorage.getItem('dsa-game-progress')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Failed to load game progress:', error)
    return null
  }
}

export const resetGameProgress = () => {
  try {
    localStorage.removeItem('dsa-game-progress')
    localStorage.removeItem('dsa-achievements')
    localStorage.removeItem('dsa-best-scores')
    return true
  } catch (error) {
    console.error('Failed to reset game progress:', error)
    return false
  }
}

/**
 * Performance analytics
 */
export const calculatePerformanceMetrics = (gameHistory) => {
  if (!gameHistory.length) return null
  
  const totalGames = gameHistory.length
  const completedGames = gameHistory.filter(game => game.completed).length
  const averageScore = gameHistory.reduce((sum, game) => sum + game.score, 0) / totalGames
  
  const gameTypeStats = gameHistory.reduce((stats, game) => {
    if (!stats[game.type]) {
      stats[game.type] = { played: 0, completed: 0, avgScore: 0 }
    }
    stats[game.type].played++
    if (game.completed) stats[game.type].completed++
    stats[game.type].avgScore += game.score
    return stats
  }, {})
  
  // Calculate averages
  Object.keys(gameTypeStats).forEach(type => {
    gameTypeStats[type].avgScore /= gameTypeStats[type].played
    gameTypeStats[type].completionRate = 
      (gameTypeStats[type].completed / gameTypeStats[type].played) * 100
  })
  
  return {
    totalGames,
    completedGames,
    completionRate: (completedGames / totalGames) * 100,
    averageScore: Math.round(averageScore),
    gameTypeStats,
    playTime: gameHistory.reduce((sum, game) => sum + (game.duration || 0), 0)
  }
}

/**
 * Hint system
 */
export const getGameHint = (gameType, gameState, level) => {
  const hints = {
    array: [
      "Look for the smallest number and move it to the front",
      "Use bubble sort: compare adjacent elements",
      "Try selection sort: find minimum and swap",
      "Think about insertion sort for smaller arrays"
    ],
    search: [
      "Always pick the middle element of the valid range",
      "If your guess is too high, search the left half",
      "If your guess is too low, search the right half",
      "Binary search cuts the problem in half each time"
    ],
    stack: [
      "Stack follows LIFO: Last In, First Out",
      "Use stack when you need to reverse order",
      "Queue follows FIFO: First In, First Out",
      "Combine operations to create complex sequences"
    ],
    tree: [
      "In BST, left children are smaller than parent",
      "Right children are larger than parent",
      "Inorder traversal gives sorted sequence",
      "Use recursion for tree operations"
    ]
  }
  
  const gameHints = hints[gameType] || hints.array
  const hintIndex = Math.min(level - 1, gameHints.length - 1)
  
  return gameHints[hintIndex]
}

// Export all utilities as default object for easier importing
export default {
  // Array utilities
  shuffleArray,
  generateRandomArray,
  isSorted,
  getMinimumSwaps,
  
  // Scoring
  calculateArrayScore,
  calculateSearchScore,
  calculateStackQueueScore,
  
  // Binary Search
  binarySearchOptimalSteps,
  getBinarySearchHint,
  getOptimalBinarySearchPath,
  
  // Stack/Queue
  generateStackSequence,
  validateStackSequence,
  canGenerateSequence,
  
  // Binary Tree
  createBinaryTree,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  
  // Game systems
  checkAchievements,
  getDifficultySettings,
  saveGameProgress,
  loadGameProgress,
  resetGameProgress,
  calculatePerformanceMetrics,
  getGameHint
}
