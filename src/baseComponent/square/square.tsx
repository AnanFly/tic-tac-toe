import { PureComponent } from 'react';
import squareStyle from '@/style/square.module.scss';
import { getColor } from '@/utils/toolsFun';
import store from '@/store';

interface SquareProps {
    onClickQiZi: (row:number, col:number) => void;
    currentValue: string;
    row:number;
    col:number;
}

class Square extends PureComponent<SquareProps> {
    render () {
        const { currentValue, onClickQiZi, row, col } = this.props;
        const { enumName, playerList } = store.getState().gameConfig.gameConfigValue;
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
    }
}

export default Square;
