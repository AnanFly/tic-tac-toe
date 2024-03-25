import { FC, memo } from 'react';
import squareStyle from '@/style/square.module.scss';
import { GameConfig } from '@/constant/gameType';
import { getColor } from '@/utils/toolsFun';
/**
 *
 * @param enumName 游戏名称枚举
 * @param playerList 玩家列表
 * @param currentValue 当前值
 */
const Square: FC<{
    gameConfig: GameConfig;
    row:number;
    col:number;
    onClickQiZi: (row: number, col: number) => void;
    currentValue: string;
}> = ({ gameConfig, currentValue, onClickQiZi, row, col }) => {
    const { enumName, playerList } = gameConfig;
    return (
        <div className={squareStyle.square} onClick={() => onClickQiZi(row, col)}>
            {enumName === 'Gobang' ? (
                <div
                    className={squareStyle.circle}
                    style={{ backgroundColor: getColor(currentValue, playerList) }}
                />
            ) : (
                currentValue
            )}
        </div>
    );
};
export default memo(Square);
