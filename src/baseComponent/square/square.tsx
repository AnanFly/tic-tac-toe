import { PureComponent } from 'react';
import squareStyle from '@/style/square.module.scss';
import { GameType } from '@/constant/gameType';
import { getColor } from '@/utils/toolsFun';

interface SquareProps {
    enumName: keyof typeof GameType;
    playerList: string[];
    onClickQiZi: () => void;
    currentValue: string;
}

class Square extends PureComponent<SquareProps> {
    render () {
        const { enumName, playerList, currentValue, onClickQiZi } = this.props;

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
    }
}

export default Square;
