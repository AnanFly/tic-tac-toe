import { isWin } from '@/utils/generalWinner';
import { Button } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { GameConfig } from '@/constant/gameType';
import Square from './square';
import { createEmptyBoard } from '@/utils/toolsFun';

interface BoardProps {
    gameConfig: GameConfig;
}

interface State {
    history: string[][][];
    winnerStep: number;
    currentStep: number;
    currentPlayer: string;
    winner: string | null;
}

/**
 * @param gameConfig 游戏配置
 * @returns
 */
const Board: FC<BoardProps> = ({ gameConfig }) => {
    const { row, col, enumName, playerList, winLength } = gameConfig;
    const [state, setBoardState] = useState<State>({
        history: [createEmptyBoard(row, col)],
        winnerStep: 0,
        currentStep: 0,
        currentPlayer: playerList[0],
        winner: null,
    });

    useEffect(() => {
        setBoardState({
            ...state,
            history: [createEmptyBoard(row, col)],
        });
    }, [gameConfig]);

    /**
     * 更改棋局state状态
     */
    const changeBoardState = (rowIndex:number, colIndex:number) => {
        // 拿到最新状态进行更改
        setBoardState((prevState) => {
            const { history, currentStep, currentPlayer, winner } = prevState;
            const currentBoard = history[currentStep];

            if (currentBoard[rowIndex][colIndex] || winner) return prevState;

            const newBoard = updateBoard(currentBoard, rowIndex, colIndex, currentPlayer);
            const hasWinner = isWin(newBoard, [rowIndex, colIndex], currentPlayer, winLength);
            const newHistory = updateHistory(prevState, newBoard);
            const newCurrentPlayer = getNextPlayer(currentPlayer);
            const newWinner = hasWinner ? currentPlayer : null;
            const newWinnerStep = hasWinner ? currentStep + 1 : prevState.winnerStep;
            return {
                ...prevState,
                history: newHistory,
                currentStep: currentStep + 1,
                currentPlayer: newCurrentPlayer,
                winner: newWinner,
                winnerStep: newWinnerStep,
            };
        });
    };


    /**
     * @description 更新棋盘状态
     */
    const updateBoard = (board:string[][], rowIndex:number, colIndex:number, currentPlayer:string) => {
        const newBoard = [...board];
        newBoard[rowIndex] = [...newBoard[rowIndex]];
        newBoard[rowIndex][colIndex] = currentPlayer;
        return newBoard;
    };

    /**
     * @description 更新历史记录
     */
    const updateHistory = (prevState:State, newBoard:string[][]) => {
        const { history, currentStep } = prevState;
        const newHistory = history.slice(0, currentStep + 1).concat([newBoard]);
        return newHistory;
    };

    /**
     * @description 获取下一个玩家
     */
    const getNextPlayer = (currentPlayer:string) => {
        const currentPlayerIndex = playerList.indexOf(currentPlayer);
        const nextPlayerIndex = (currentPlayerIndex + 1) % playerList.length;
        return playerList[nextPlayerIndex];
    };

    /**
     * 点击单个格子
     */
    const handleClick = useCallback((rowIndex: number, colIndex: number) => {
        changeBoardState(rowIndex, colIndex);
    }, []);

    /**
     *
     * @param step 步数
     */
    const jumpTo = (step: number) => {
        const player = step % 2 === 0 ? playerList[0] : playerList[1];
        const winner = step === state.winnerStep ? playerList[(step % 2) - 1] : null;
        setBoardState((prevState) => ({
            ...prevState,
            currentStep: step,
            currentPlayer: player,
            winner,
        }));
    };

    const moves = state.history.map((__, step) => {
        if (step === 0) return null;
        return (
            <Button key={step} onClick={() => jumpTo(step)}>
                {`回退到第${step}步`}
            </Button>
        );
    });

    return (
        <>
            <h3>当前游戏: {GameConfig[enumName].name}</h3>
            <h3>当前玩家: {state.currentPlayer}</h3>
            {state.winner && <h3>胜利者: {state.winner}</h3>}
            {state.history[state.currentStep].map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((__, colIndex) =>
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            gameConfig={gameConfig}
                            row={rowIndex}
                            col={colIndex}
                            currentValue={state.history[state.currentStep][rowIndex][colIndex]}
                            onClickQiZi={handleClick}
                        />)}
                </div>
            ))}
            {moves}
        </>
    );
};

export default Board;
