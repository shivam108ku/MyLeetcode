// components/games/StackQueueGame.jsx
import React from 'react'
import GameHeader from '../gamesUi/GameHeader'
import Button from '../gamesUi/Button'

const StackQueueGame = ({ gameState, stackGame, setStackGame, updateGameState, backToMenu }) => {
  const handleStackOperation = (operation, value = null) => {
    let newStack = [...stackGame.stack]
    let newQueue = [...stackGame.queue]
    let operationText = ''
    
    switch (operation) {
      case 'push':
        if (value !== null) {
          newStack.push(value)
          operationText = `PUSH(${value}) to Stack`
        }
        break
      case 'pop':
        if (newStack.length > 0) {
          const popped = newStack.pop()
          operationText = `POP() from Stack → ${popped}`
        }
        break
      case 'enqueue':
        if (value !== null) {
          newQueue.push(value)
          operationText = `ENQUEUE(${value}) to Queue`
        }
        break
      case 'dequeue':
        if (newQueue.length > 0) {
          const dequeued = newQueue.shift()
          operationText = `DEQUEUE() from Queue → ${dequeued}`
        }
        break
    }
    
    setStackGame(prev => ({
      ...prev,
      stack: newStack,
      queue: newQueue,
      operations: [...prev.operations.slice(-4), operationText],
      currentInput: ''
    }))
  }

  return (
    <div className="min-h-screen w-[93%] ml-[12vh] mx-auto p-4">
      <GameHeader
        title="Stack & Queue Operations"
        subtitle={stackGame.challenge}
        onBack={backToMenu}
      />

      {/* Input Controls */}
      <ControlPanel
        currentInput={stackGame.currentInput}
        onInputChange={(value) => setStackGame(prev => ({ ...prev, currentInput: value }))}
        onPush={() => handleStackOperation('push', parseInt(stackGame.currentInput))}
        onEnqueue={() => handleStackOperation('enqueue', parseInt(stackGame.currentInput))}
      />

      {/* Data Structures Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <StackVisualization
          stack={stackGame.stack}
          onPop={() => handleStackOperation('pop')}
        />
        <QueueVisualization
          queue={stackGame.queue}
          onDequeue={() => handleStackOperation('dequeue')}
        />
      </div>

      {/* Operations Log */}
      <OperationsLog operations={stackGame.operations} />
    </div>
  )
}

const ControlPanel = ({ currentInput, onInputChange, onPush, onEnqueue }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 mb-8 border border-gray-700">
    <div className="flex flex-wrap justify-center gap-4 items-center">
      <input
        type="number"
        value={currentInput}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Enter number"
        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
      />
      <Button
        variant="primary"
        onClick={onPush}
        disabled={!currentInput}
      >
        Push to Stack
      </Button>
      <Button
        variant="secondary"
        onClick={onEnqueue}
        disabled={!currentInput}
      >
        Enqueue
      </Button>
    </div>
  </div>
)

const StackVisualization = ({ stack, onPop }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
    <h3 className="text-xl font-bold text-white mb-4 text-center">Stack (LIFO)</h3>
    <div className="min-h-64 border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col-reverse items-center justify-start gap-2">
      {stack.length === 0 ? (
        <div className="text-gray-500 text-center">Stack is empty</div>
      ) : (
        stack.map((value, index) => (
          <div
            key={index}
            className="w-16 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold border-2 border-white/20 animate-pulse"
          >
            {value}
          </div>
        ))
      )}
    </div>
    <Button
      variant="danger"
      onClick={onPop}
      disabled={stack.length === 0}
      className="w-full mt-4"
    >
      Pop from Stack
    </Button>
  </div>
)

const QueueVisualization = ({ queue, onDequeue }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
    <h3 className="text-xl font-bold text-white mb-4 text-center">Queue (FIFO)</h3>
    <div className="min-h-64 border-2 border-dashed border-gray-600 rounded-lg p-4">
      <div className="h-full flex items-center justify-center">
        {queue.length === 0 ? (
          <div className="text-gray-500">Queue is empty</div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {queue.map((value, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold border-2 border-white/20 animate-pulse"
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Button
      variant="warning"
      onClick={onDequeue}
      disabled={queue.length === 0}
      className="w-full mt-4"
    >
      Dequeue from Queue
    </Button>
  </div>
)

const OperationsLog = ({ operations }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700">
    <h3 className="text-xl font-bold text-white mb-4">Operations Log</h3>
    <div className="bg-gray-900/50 rounded-lg p-4 max-h-32 overflow-y-auto">
      {operations.length === 0 ? (
        <div className="text-gray-500 text-center">No operations yet</div>
      ) : (
        operations.map((op, index) => (
          <div key={index} className="text-green-400 font-mono text-sm py-1">
            {op}
          </div>
        ))
      )}
    </div>
  </div>
)

export default StackQueueGame
