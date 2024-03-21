import { FC, memo } from 'react';
import squareStyle from '@/style/square.module.scss';
import { GameType } from '@/constant/gameType';
import { getColor } from '@/utils/toolsFun';
/**
 *
 * @param enumName 游戏名称枚举
 * @param playerList 玩家列表
 * @param currentValue 当前值
 */
const Square: FC<{
    enumName: keyof typeof GameType;
    playerList: string[];
    onClickQiZi: (row: number, col: number) => void;
    rowIndex: number;
    colIndex: number;
    currentValue: string;
}> = ({ enumName, playerList, currentValue, onClickQiZi, rowIndex, colIndex }) => {
    return (
        <div className={squareStyle.square} onClick={() => onClickQiZi(rowIndex, colIndex)}>
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
