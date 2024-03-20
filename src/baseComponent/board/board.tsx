import { Component } from 'react';
import { isWin } from '@/utils/generalWinner';
import { Button } from 'antd';
import { GameConfig } from '@/constant/gameType';
import Square from '../square/square';
import {
    initBoard, initialBoardState, selectBoard, setCurrentPlayer, setCurrentStep, setHistory, setWinner, setWinnerStep
} from '@/features/boardSlice';
import { connect } from 'react-redux';
import { selectGameConfig } from '@/features/appGameSlice';

interface BoardProps {
    gameConfigValue: GameConfig;
    initState: initialBoardState;
    initBoard: (config: { row: number, col: number }) => void;
    setCurrentPlayer: (player: string) => void;
    setCurrentStep: (step: number) => void;
    setHistory: (history: string[][][]) => void;
    setWinner: (winner: string | null) => void;
    setWinnerStep: (step: number) => void;
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
        const newBoard = [...currentBoard];
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = currentPlayer;
        const hasWinner = isWin(newBoard, [row, col], currentPlayer, winLength);

        const {
            setHistory,
            setCurrentStep,
            setCurrentPlayer,
            setWinner,
            setWinnerStep,
        } = this.props;

        setHistory([...history.slice(0, currentStep + 1), newBoard]);
        setCurrentStep(currentStep + 1);
        setCurrentPlayer(playerList[currentStep % 2 === 0 ? 1 : 0]);
        setWinner(hasWinner ? currentPlayer : null);
        if (hasWinner) {
            setWinnerStep(currentStep + 1);
        }
    };

    jumpTo = (step: number) => {
        const { playerList } = this.props.gameConfigValue;
        const { setCurrentStep, setCurrentPlayer, setWinner, initState } = this.props;

        setCurrentStep(step);
        setCurrentPlayer(playerList[step % 2 === 0 ? 0 : 1]);
        const winner = step === initState.winnerStep ? playerList[(step % 2) - 1] : null;
        step === initState.winnerStep ? setWinner(winner) : setWinner(null);
    };

    render () {
        const { enumName } = this.props.gameConfigValue;
        const { currentPlayer, history, winner, currentStep } = this.props.initState;
        const { gameConfigValue } = this.props;

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
                        enumName={enumName}
                        playerList={gameConfigValue.playerList}
                        currentValue={history[currentStep][rowIndex][colIndex]}
                        onClickQiZi={() => this.handleClick(rowIndex, colIndex)}
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
    setCurrentPlayer,
    setCurrentStep,
    setHistory,
    setWinner,
    setWinnerStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
