import { useState } from 'react'
import { GameConfig, GameType } from './constant/gameType'
import Board from './baseComponent/board'
import { Button } from 'antd'

export default function App() {
  const [gameBaseConfig, setGameBaseConfig] = useState(GameConfig['TicTacToe'])
  return (
    <div>
      <Button
        onClick={() => {
          setGameBaseConfig(
            gameBaseConfig.enumName === GameType.Gobang
              ? GameConfig[GameType.TicTacToe]
              : GameConfig[GameType.Gobang]
          )
        }}
        type="primary"
      >
        切换游戏
      </Button>
      <Board gameConfig={gameBaseConfig} />
    </div>
  )
}
