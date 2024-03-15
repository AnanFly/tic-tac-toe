import { FC } from 'react'
import squareStyle from '@/style/square.module.scss'
import { GameType } from '@/constant/gameType'
// 格子
const Square: FC<{
  enumName: keyof typeof GameType
  playerList: string[]
  currentValue: string
}> = ({ enumName, playerList, currentValue }) => {
  return (
    <div className={squareStyle.square}>
      {enumName === 'Gobang' ? (
        <div
          className={squareStyle.circle}
          style={{
            backgroundColor:
              currentValue === playerList[0]
                ? 'black'
                : currentValue === playerList[1]
                  ? 'white'
                  : ''
          }}
        />
      ) : (
        currentValue
      )}
    </div>
  )
}
export default Square
