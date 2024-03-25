import { Component } from 'react';
import { getBestMove, isWin } from '@/utils/generalWinner';
import { Button } from 'antd';
import { GameConfig } from '@/constant/gameType';
import Square from '../square/square';
import { initBoard, initialBoardState, selectBoard, setBoardState } from '@/features/boardSlice';
import { connect } from 'react-redux';
import { selectGameConfig } from '@/features/appGameSlice';

interface BoardProps {
    gameConfigValue: GameConfig;
    initState: initialBoardState;
    initBoard: (config: { row: number, col: number }) => void;
    setBoardState: (state: initialBoardState) => void;
}


class Board extends Component<BoardProps, initialBoardState> {
    constructor (props: BoardProps) {
        super(props);
    }

    componentDidMount () {
        const { row, col } = this.props.gameConfigValue;
        this.props.initBoard({ row, col });
    }

    handleClick = (row: number, col: number) => {
        const { currentPlayer, currentStep, history, winner } = this.props.initState;

        const { playerList, winLength } = this.props.gameConfigValue;

        const currentBoard = history[currentStep];
        if (currentBoard[row][col] || winner) return;

        // 更新棋盘数据
        const newBoard = [...currentBoard];
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = currentPlayer;

        // 判断是否有玩家获胜
        const hasWinner = isWin(newBoard, [row, col], currentPlayer, winLength);

        const { setBoardState } = this.props;

        // 更新棋盘状态
        setBoardState({
            history: [...history.slice(0, currentStep + 1), newBoard],
            currentStep: currentStep + 1,
            currentPlayer: playerList[currentStep % 2 === 0 ? 1 : 0],
            winner: hasWinner ? currentPlayer : null,
            winnerStep: hasWinner ? currentStep + 1 : 0,
        });
        // console.log('currentPlayer:', currentPlayer, 'hasWinner:', hasWinner);

        if (currentPlayer === 'X' && !hasWinner) {
            setTimeout(() => {
                this.autoPlay();
            }, 500);
        }
    };

    autoPlay = () => {
        const { history } = this.props.initState;
        // console.log('当前棋盘', history[history.length - 1]);

        const [row, col] = getBestMove(history[history.length - 1], 'O', 'X');
        this.handleClick(row, col);
    }

    jumpTo = (step: number) => {
        const { playerList } = this.props.gameConfigValue;
        const { initState, setBoardState } = this.props;
        setBoardState({
            ...initState,
            currentStep: step,
            currentPlayer: playerList[step % 2 === 0 ? 0 : 1],
            winner: step === initState.winnerStep ? playerList[step % 2 === 0 ? 1 : 0] : null,
        });
    };

    render () {
        const { enumName } = this.props.gameConfigValue;
        const { currentPlayer, history, winner, currentStep } = this.props.initState;

        const moves = history.map((__, step) => {
            if (step === 0) return null;
            return (
                <Button key={step} onClick={() => this.jumpTo(step)}>
                    {`回退到第${step}步`}
                </Button>
            );
        });

        const squares = history[currentStep]?.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
                {row?.map((__, colIndex) => (
                    <Square
                        key={`${rowIndex}-${colIndex}`}
                        row={rowIndex}
                        col={colIndex}
                        currentValue={history[currentStep][rowIndex][colIndex]}
                        onClickQiZi={this.handleClick}
                    />
                ))}
            </div>
        ));

        return (
            <>
                <h3>当前游戏: {GameConfig[enumName].name}</h3>
                <h3>当前玩家: {currentPlayer}</h3>
                {winner && <h3>胜利者: {winner}</h3>}
                {squares}
                {moves}
            </>
        );
    }
}

/**
 * @description: 将state映射到组件的props中
 */
const mapStateToProps = (state: { gameConfig: { gameConfigValue: GameConfig }, board: initialBoardState }) => ({
    gameConfigValue: selectGameConfig(state),
    initState: selectBoard(state),
});

const mapDispatchToProps = {
    initBoard,
    setBoardState,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
