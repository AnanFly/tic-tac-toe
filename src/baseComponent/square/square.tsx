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
    onClickQiZi: () => void;
    currentValue: string;
}> = ({ enumName, playerList, currentValue, onClickQiZi }) => {
    return (
        <div className={squareStyle.square} onClick={onClickQiZi}>
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