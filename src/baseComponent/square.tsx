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
interface Square {
    gameConfig: GameConfig;
    coordinates: [number, number];
    onClickQiZi: (row: number, col: number) => void;
    currentValue: string;
}
/** 格子组件 */
const Square: FC<Square> = ({ gameConfig, currentValue, onClickQiZi, coordinates }) => {
    const { enumName, playerList } = gameConfig;
    const [row, col] = coordinates;

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
