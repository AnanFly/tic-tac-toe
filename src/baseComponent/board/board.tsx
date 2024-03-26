import { Component } from 'react';
import {  isWin, getBestAiMove } from '@/utils/generalWinner';
import { Button, Select, Spin } from 'antd';
import { GameConfig, GameType, aiPlayer, ownPlayer } from '@/constant/gameType';
import Square from '../square/square';
import { initBoard, initialBoardState, selectBoard, setBoardState } from '@/features/boardSlice';
import { connect } from 'react-redux';
import { selectGameConfig } from '@/features/appGameSlice';
import { createEmptyBoard } from '@/utils/toolsFun';
import store from '@/store';

interface BoardProps {
    gameConfigValue: GameConfig;
    initState: initialBoardState;
    initBoard: (config: { row: number, col: number }) => void;
    setBoardState: (state: initialBoardState) => void;
    resetBoard: () => void;
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
        const { currentPlayer, currentStep, history, winner } = store.getState().board;
        const { enumName } =  store.getState().gameConfig.gameConfigValue;
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

        const findRoleIndex = playerList.findIndex((role) => role === currentPlayer);

        // 更新棋盘状态
        setBoardState({
            history: [...history.slice(0, currentStep + 1), newBoard],
            currentStep: currentStep + 1,
            currentPlayer: playerList[(findRoleIndex + 1) % 2],
            winner: hasWinner ? currentPlayer : null,
            winnerStep: hasWinner ? currentStep + 1 : 0,
        });
        // 只有井字棋且当前玩家是AI时，才会自动落子
        if (store.getState().board.currentPlayer === aiPlayer && !hasWinner && enumName === GameType.TicTacToe) {
            this.autoAiPlay();
        }
    };

    jumpTo = (step: number) => {
        const { playerList } = this.props.gameConfigValue;
        const { initState, setBoardState } = this.props;
        const { currentPlayer } = store.getState().board;
        const findRoleIndex = playerList.findIndex((role) => role === currentPlayer);
        setBoardState({
            ...initState,
            currentStep: step,
            currentPlayer: playerList[(findRoleIndex + 1) % 2],
            winner: step === initState.winnerStep ? playerList[step % 2 === 0 ? 1 : 0] : null,
        });
    };

    // 选择先手
    handleFirstRole = (value: string) => {
        const { setBoardState } = this.props;
        setBoardState({
            history: [createEmptyBoard(3, 3)],
            winnerStep: 0,
            currentStep: 0,
            winner: null,
            currentPlayer: value === ownPlayer ? ownPlayer : aiPlayer,
        });
        if (value === aiPlayer) {
            this.autoAiPlay();
        }
    }

    autoAiPlay = async () => {
        const { currentPlayer, history, currentStep, winner } = store.getState().board;
        if (currentPlayer === aiPlayer && !winner) {
            const [row, col]  = await getBestAiMove(history[currentStep], aiPlayer);
            if (row === -1 || col === -1) return;
            this.handleClick(row, col);
        }
    }

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
                {
                    enumName === GameType.TicTacToe && (
                        <>
                            <h3>先手：</h3>
                            <Select
                                defaultValue={ownPlayer}
                                style={{ width: 120 }}
                                onChange={this.handleFirstRole}
                            >
                                <Select.Option value="O">真人玩家</Select.Option>
                                <Select.Option value="X">AI玩家</Select.Option>
                            </Select>
                        </>
                    )
                }
                <h3>当前游戏: {GameConfig[enumName].name}</h3>
                <h3>当前玩家: {currentPlayer}</h3>
                {winner && <h3>胜利者: {winner}</h3>}
                <Spin spinning={currentPlayer === aiPlayer} tip="AI思考中...">
                    {squares}
                </Spin>
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
