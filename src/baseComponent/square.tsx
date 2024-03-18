import { FC } from 'react';
import squareStyle from '@/style/square.module.scss';
import { GameType } from '@/constant/gameType';
/**
 *
 * @param enumName 游戏名称枚举
 * @param playerList 玩家列表
 * @param currentValue 当前值
 */
const Square: FC<{
    enumName: keyof typeof GameType;
    playerList: string[];
    currentValue: string;
}> = ({ enumName, playerList, currentValue }) => {
    /**
   * 判断当前值是黑子还是白子
   */
    function getColor (currentValue: string, playerList: string[]): string {
        if (currentValue === playerList[0]) {
            return 'black';
        } else if (currentValue === playerList[1]) {
            return 'white';
        }
        return '';
    }
    return (
        <div className={squareStyle.square}>
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
export default Square;
